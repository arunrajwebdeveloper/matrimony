import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MatchRequest,
  MatchRequestDocument,
} from './schemas/match-request.schema';
import { CreateMatchRequestDto } from './dto/create-match-request.dto';
import { UsersService } from '../users/users.service';
import { ChatService } from '../chat/chat.service'; // Import ChatService
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2

@Injectable()
export class MatchRequestsService {
  constructor(
    @InjectModel(MatchRequest.name)
    private matchRequestModel: Model<MatchRequestDocument>,
    private usersService: UsersService,
    private chatService: ChatService, // Inject ChatService
    private eventEmitter: EventEmitter2, // Inject EventEmitter2
  ) {}

  async sendRequest(
    senderId: Types.ObjectId,
    createMatchRequestDto: CreateMatchRequestDto,
  ): Promise<MatchRequestDocument> {
    const { recipientId, message } = createMatchRequestDto;

    // Ensure sender and recipient are different
    if (senderId.toString() === recipientId.toString()) {
      throw new BadRequestException('Cannot send a match request to yourself.');
    }

    // Check if recipient exists
    const recipientUser = await this.usersService.findById(recipientId);
    if (!recipientUser || recipientUser.deletedAt) {
      throw new NotFoundException('Recipient user not found.');
    }

    // Check for existing pending request (sender -> recipient)
    const existingRequest = await this.matchRequestModel
      .findOne({
        sender: senderId,
        recipient: recipientId,
        status: 'pending',
        deletedAt: null,
      })
      .exec();

    if (existingRequest) {
      throw new BadRequestException(
        'A pending request already exists for this recipient.',
      );
    }

    // Check for existing pending request (recipient -> sender)
    const reverseRequest = await this.matchRequestModel
      .findOne({
        sender: recipientId,
        recipient: senderId,
        status: 'pending',
        deletedAt: null,
      })
      .exec();

    if (reverseRequest) {
      // If a reverse request exists, automatically accept it and create a conversation
      reverseRequest.status = 'accepted';
      reverseRequest.respondedAt = new Date();
      await reverseRequest.save();

      // Create conversation
      await this.chatService.createConversation(
        reverseRequest.sender,
        reverseRequest.recipient,
      );

      // Emit event for match accepted
      this.eventEmitter.emit('match.accepted', {
        user1Id: reverseRequest.sender,
        user2Id: reverseRequest.recipient,
      });

      return reverseRequest; // Return the accepted reverse request
    }

    const newRequest = new this.matchRequestModel({
      sender: senderId,
      recipient: new Types.ObjectId(recipientId),
      message,
      status: 'pending',
    });

    const savedRequest = await newRequest.save();

    // Emit event for new match request
    this.eventEmitter.emit('match.requestSent', {
      senderId: savedRequest.sender,
      recipientId: savedRequest.recipient,
    });

    return savedRequest;
  }

  async getSentRequests(
    senderId: Types.ObjectId,
  ): Promise<MatchRequestDocument[]> {
    return this.matchRequestModel
      .find({ sender: senderId, deletedAt: null })
      .populate('recipient', 'fullName email')
      .exec();
  }

  async getReceivedRequests(
    recipientId: Types.ObjectId,
  ): Promise<MatchRequestDocument[]> {
    return this.matchRequestModel
      .find({ recipient: recipientId, deletedAt: null })
      .populate('sender', 'fullName email')
      .exec();
  }

  async respondToRequest(
    requestId: string,
    recipientId: Types.ObjectId,
    action: 'accepted' | 'rejected',
  ): Promise<MatchRequestDocument> {
    const request = await this.matchRequestModel
      .findOne({
        _id: requestId,
        recipient: recipientId,
        status: 'pending',
        deletedAt: null,
      })
      .exec();

    if (!request) {
      throw new NotFoundException('Match request not found or not pending.');
    }

    request.status = action;
    request.respondedAt = new Date();
    await request.save();

    if (action === 'accepted') {
      // Create conversation if accepted
      await this.chatService.createConversation(
        request.sender,
        request.recipient,
      );
      // Emit event for match accepted
      this.eventEmitter.emit('match.accepted', {
        user1Id: request.sender,
        user2Id: request.recipient,
      });
    } else {
      // Emit event for match rejected
      this.eventEmitter.emit('match.rejected', {
        senderId: request.sender,
        recipientId: request.recipient,
      });
    }

    return request;
  }
}
