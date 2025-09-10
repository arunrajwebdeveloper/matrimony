import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import {
  UserInteraction,
  UserInteractionSchema,
} from './schemas/user-interaction.schema';
import { Profile, ProfileSchema } from '../profiles/schemas/profile.schema';
import { UploadModule } from '../upload/upload.module';

/**
 * The MatchesModule now uses Mongoose to connect to the 'Profile'
 * and 'UserInteraction' collections, enabling direct database operations.
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: UserInteraction.name, schema: UserInteractionSchema },
    ]),
    forwardRef(() => UploadModule),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
