import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserInteractionsService } from './user-interactions.service';
import { UserInteractionsController } from './user-interactions.controller';
import {
  UserInteractions,
  UserInteractionsSchema,
} from './schemas/user-interactions.schema';
import {
  UserInteractionLists,
  UserInteractionListsSchema,
} from './schemas/user-interaction-lists.schema';
import { Profile, ProfileSchema } from '../profiles/schemas/profile.schema';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserInteractions.name, schema: UserInteractionsSchema },
      { name: UserInteractionLists.name, schema: UserInteractionListsSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
    // forwardRef(() => UploadModule),
    UploadModule,
  ],
  controllers: [UserInteractionsController],
  providers: [UserInteractionsService],
  exports: [UserInteractionsService],
})
export class UserInteractionsModule {}
