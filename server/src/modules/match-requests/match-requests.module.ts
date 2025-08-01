import { Module } from '@nestjs/common';
import { MatchRequestsService } from './match-requests.service';
import { MatchRequestsController } from './match-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MatchRequest,
  MatchRequestSchema,
} from './schemas/match-request.schema';
import { UsersModule } from '../users/users.module'; // Needed to check recipient existence
import { ProfilesModule } from '../profiles/profiles.module'; // Needed to check profile existence
import { ChatModule } from '../chat/chat.module'; // Import ChatModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MatchRequest.name, schema: MatchRequestSchema },
    ]),
    UsersModule, // Import UsersModule
    ProfilesModule, // Import ProfilesModule
    ChatModule, // Import ChatModule
  ],
  providers: [MatchRequestsService],
  controllers: [MatchRequestsController],
  exports: [MatchRequestsService],
})
export class MatchRequestsModule {}
