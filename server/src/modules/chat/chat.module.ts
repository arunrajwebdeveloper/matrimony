import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from './schemas/conversation.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { UsersModule } from '../users/users.module'; // Needed for user references
import { ChatGateway } from './chat.gateway'; // Import ChatGateway
import { AuthModule } from '../auth/auth.module'; // Import AuthModule for JwtService

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    UsersModule,
    AuthModule, // Import AuthModule
  ],
  providers: [ChatService, ChatGateway], // Add ChatGateway to providers
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
