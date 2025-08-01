import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private usersService: UsersService,
    private eventEmitter: EventEmitter2, // Inject EventEmitter2
  ) {}

  async createConversation(
    participant1Id: Types.ObjectId,
    participant2Id: Types.ObjectId,
  ): Promise<ConversationDocument> {
    // Ensure participants exist
    const [p1, p2] = await Promise.all([
      this.usersService.findById(participant1Id),
      this.usersService.findById(participant2Id),
    ]);

    if (!p1 || !p2 || p1.deletedAt || p2.deletedAt) {
      throw new BadRequestException(
        'One or both participants not found or deactivated.',
      );
    }

    // Check if conversation already exists between these two users
    const existingConversation = await this.conversationModel
      .findOne({
        participants: { $all: [participant1Id, participant2Id] },
        deletedAt: null,
      })
      .exec();

    if (existingConversation) {
      return existingConversation; // Return existing conversation if found
    }

    const newConversation = new this.conversationModel({
      participants: [participant1Id, participant2Id],
    });
    const savedConversation = await newConversation.save();

    // Emit event for new conversation
    this.eventEmitter.emit('chat.conversationCreated', {
      conversationId: savedConversation._id,
      participants: savedConversation.participants,
    });

    return savedConversation;
  }

  async getConversations(
    userId: Types.ObjectId,
  ): Promise<ConversationDocument[]> {
    return this.conversationModel
      .find({ participants: userId, deletedAt: null })
      .populate('participants', 'fullName profilePicture') // Populate basic user info
      .populate('lastMessage') // Populate last message details
      .sort({ 'lastMessage.createdAt': -1 }) // Sort by last message time
      .exec();
  }

  async getMessagesInConversation(
    conversationId: string,
    userId: Types.ObjectId,
  ): Promise<MessageDocument[]> {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (
      !conversation ||
      conversation.deletedAt ||
      !conversation.participants.includes(userId)
    ) {
      throw new NotFoundException('Conversation not found or access denied.');
    }

    return this.messageModel
      .find({ conversation: conversationId, deletedAt: null })
      .populate('sender', 'fullName profilePicture')
      .sort({ createdAt: 1 }) // Oldest messages first
      .exec();
  }

  async sendMessage(
    conversationId: string,
    senderId: Types.ObjectId,
    content: string,
    type: string = 'text',
  ): Promise<MessageDocument> {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();
    if (
      !conversation ||
      conversation.deletedAt ||
      !conversation.participants.includes(senderId)
    ) {
      throw new NotFoundException('Conversation not found or access denied.');
    }

    const newMessage = new this.messageModel({
      conversation: conversationId,
      sender: senderId,
      content,
      type,
    });
    const savedMessage = await newMessage.save();

    // Update lastMessage in conversation
    conversation.lastMessage = savedMessage._id as Types.ObjectId;
    // Reset read status for the other participant
    const otherParticipantId = conversation.participants.find(
      (p) => p.toString() !== senderId.toString(),
    );
    if (otherParticipantId) {
      conversation.readStatus.set(otherParticipantId.toString(), false);
    }
    conversation.readStatus.set(senderId.toString(), true); // Sender has read their own message
    await conversation.save();

    // Emit event for new message
    this.eventEmitter.emit('chat.newMessage', {
      message: savedMessage,
      conversationId: conversation._id,
      senderId: savedMessage.sender,
      recipientIds: conversation.participants.filter(
        (p) => p.toString() !== senderId.toString(),
      ),
    });

    return savedMessage;
  }

  async markMessageAsRead(
    messageId: string,
    userId: Types.ObjectId,
  ): Promise<MessageDocument> {
    const message = await this.messageModel.findById(messageId).exec();
    if (!message || message.deletedAt) {
      throw new NotFoundException('Message not found.');
    }
    if (message.sender.toString() === userId.toString()) {
      throw new BadRequestException(
        'Cannot mark your own sent message as unread.',
      );
    }

    message.isRead = true;
    await message.save();

    // Update conversation read status
    const conversation = await this.conversationModel
      .findById(message.conversation)
      .exec();
    if (conversation) {
      conversation.readStatus.set(userId.toString(), true);
      await conversation.save();
    }

    // Emit event for message read
    this.eventEmitter.emit('chat.messageRead', {
      messageId: message._id,
      conversationId: message.conversation,
      readerId: userId,
    });

    return message;
  }
}
