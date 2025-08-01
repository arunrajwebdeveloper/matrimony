import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { Types } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter'; // Import OnEvent

interface AuthenticatedSocket extends Socket {
  user: {
    _id: string;
    email: string;
    profileId: string;
    // Add other relevant user properties from JWT payload
  };
}

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust for your frontend URL in production
    credentials: true,
  },
  namespace: '/chat', // Namespace for chat related sockets
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  // Store connected users by their userId
  private connectedUsers: Map<string, Socket> = new Map();

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}

  async handleConnection(client: AuthenticatedSocket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    const token = client.handshake.auth.token;

    if (!token) {
      this.logger.warn(`Client ${client.id} disconnected: No token provided`);
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      client.user = payload; // Attach user payload to socket
      this.connectedUsers.set(client.user._id, client); // Store socket by user ID
      this.logger.log(
        `Client ${client.id} authenticated as user ${client.user._id}`,
      );

      // Join a room specific to the user for direct notifications
      client.join(client.user._id);

      // Notify user about successful connection (optional)
      client.emit('connected', { message: 'Successfully connected to chat.' });
    } catch (error) {
      this.logger.error(
        `Client ${client.id} authentication failed: ${error.message}`,
      );
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    if (client.user && this.connectedUsers.has(client.user._id)) {
      this.connectedUsers.delete(client.user._id);
      this.logger.log(`User ${client.user._id} disconnected.`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: AuthenticatedSocket,
    payload: { conversationId: string; content: string; type?: string },
  ) {
    if (!client.user) {
      client.emit('error', 'Authentication required.');
      return;
    }

    try {
      const { conversationId, content, type } = payload;
      const senderId = new Types.ObjectId(client.user._id);

      const message = await this.chatService.sendMessage(
        conversationId,
        senderId,
        content,
        type,
      );

      // Emit the new message to all participants in the conversation room
      const conversation = await this.chatService.getMessagesInConversation(
        conversationId,
        senderId,
      ); // Re-fetch to get populated sender
      const populatedMessage = conversation.find(
        (msg) => msg._id?.toString() === message._id?.toString(),
      );

      const participants = (
        await this.chatService.createConversation(
          senderId,
          new Types.ObjectId(conversationId),
        )
      ).participants; // Get participants from conversation
      participants.forEach((participantId) => {
        this.server
          .to(participantId.toString())
          .emit('newMessage', populatedMessage);
      });

      this.logger.log(
        `Message sent in conversation ${conversationId} by user ${client.user._id}`,
      );
    } catch (error) {
      this.logger.error(`Error sending message: ${error.message}`);
      client.emit('error', `Failed to send message: ${error.message}`);
    }
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(
    client: AuthenticatedSocket,
    conversationId: string,
  ) {
    if (!client.user) {
      client.emit('error', 'Authentication required.');
      return;
    }
    try {
      const conversation = await this.chatService.getMessagesInConversation(
        conversationId,
        new Types.ObjectId(client.user._id),
      );
      if (!conversation) {
        throw new NotFoundException('Conversation not found or access denied.');
      }
      client.join(conversationId); // Join the specific conversation room
      this.logger.log(
        `User ${client.user._id} joined conversation room: ${conversationId}`,
      );
      client.emit('joinedConversation', {
        conversationId,
        messages: conversation,
      });
    } catch (error) {
      this.logger.error(
        `Error joining conversation ${conversationId}: ${error.message}`,
      );
      client.emit('error', `Failed to join conversation: ${error.message}`);
    }
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(client: AuthenticatedSocket, messageId: string) {
    if (!client.user) {
      client.emit('error', 'Authentication required.');
      return;
    }
    try {
      const updatedMessage = await this.chatService.markMessageAsRead(
        messageId,
        new Types.ObjectId(client.user._id),
      );
      // Optionally, emit to the sender that their message has been read
      const senderSocket = this.connectedUsers.get(
        updatedMessage.sender.toString(),
      );
      if (senderSocket) {
        senderSocket.emit('messageReadConfirmation', {
          messageId: updatedMessage._id,
          readerId: client.user._id,
        });
      }
      this.logger.log(
        `Message ${messageId} marked as read by user ${client.user._id}`,
      );
    } catch (error) {
      this.logger.error(`Error marking message as read: ${error.message}`);
      client.emit('error', `Failed to mark message as read: ${error.message}`);
    }
  }

  // Event listeners for real-time notifications
  @OnEvent('chat.newMessage')
  async handleNewMessageEvent(payload: {
    message: any;
    conversationId: string;
    senderId: Types.ObjectId;
    recipientIds: Types.ObjectId[];
  }) {
    // The message is already emitted by the sender's socket in handleSendMessage
    // This listener can be used for other purposes, e.g., sending push notifications
    this.logger.log(`New message event received: ${payload.message._id}`);
  }

  @OnEvent('chat.conversationCreated')
  async handleConversationCreatedEvent(payload: {
    conversationId: Types.ObjectId;
    participants: Types.ObjectId[];
  }) {
    this.logger.log(`Conversation created event: ${payload.conversationId}`);
    // Notify participants that a new conversation has been created
    payload.participants.forEach((participantId) => {
      const participantSocket = this.connectedUsers.get(
        participantId.toString(),
      );
      if (participantSocket) {
        participantSocket.emit('newConversation', {
          conversationId: payload.conversationId,
        });
      }
    });
  }
}
