import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Profile, ProfileSchema } from '../profiles/schemas/profile.schema';
import { UploadModule } from '../upload/upload.module';
import { UserInteractionsModule } from '../user-interactions/user-interactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Profile.name, schema: ProfileSchema }, // Also register Profile schema here for population
    ]),
    forwardRef(() => UploadModule), // 👈 handle circular dep
    UserInteractionsModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // Export UsersService for use in other modules (e.g., AuthModule)
})
export class UsersModule {}
