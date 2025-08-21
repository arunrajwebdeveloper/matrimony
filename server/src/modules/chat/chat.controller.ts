import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations/:participant2Id')
  @ApiOperation({ summary: 'Create or get a conversation with another user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conversation created or retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid participant ID.',
  })
  async createOrGetConversation(
    @Request() req: any,
    @Param('participant2Id') participant2Id: string,
  ) {
    // Ensure participant2Id is a valid ObjectId
    const participant2ObjectId = new (
      this.chatService as any
    ).usersService.userModel.base.Types.ObjectId(participant2Id);
    return this.chatService.createConversation(
      req.user._id,
      participant2ObjectId,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversations retrieved successfully.',
  })
  async getMyConversations(@Request() req: any) {
    return this.chatService.getConversations(req.user._id);
  }

  @Get('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Get messages within a specific conversation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Messages retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Conversation not found or access denied.',
  })
  async getMessages(
    @Request() req: any,
    @Param('conversationId') conversationId: string,
  ) {
    return this.chatService.getMessagesInConversation(
      conversationId,
      req.user._id,
    );
  }

  @Post('conversations/:conversationId/messages')
  @ApiOperation({ summary: 'Send a message in a conversation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message sent successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Conversation not found or access denied.',
  })
  @ApiBody({ type: CreateMessageDto })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Request() req: any,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.chatService.sendMessage(
      conversationId,
      req.user._id,
      createMessageDto.content,
      createMessageDto.type,
    );
  }

  @Put('messages/:messageId/read')
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Message marked as read.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Message not found.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot mark your own message as read.',
  })
  async markMessageAsRead(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    return this.chatService.markMessageAsRead(messageId, req.user._id);
  }
}
