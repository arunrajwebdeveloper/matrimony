import { forwardRef, Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './schemas/profile.schema';
import { User, UserSchema } from '../users/schemas/user.schema'; // Import User schema for population
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Profile.name, schema: ProfileSchema },
      { name: User.name, schema: UserSchema }, // Also register User schema here for population
    ]),
    forwardRef(() => UploadModule),
  ],
  providers: [ProfilesService], // Add EventEmitter2 to providers
  controllers: [ProfilesController],
  exports: [ProfilesService], // Export ProfilesService for use in other modules (e.g., AuthModule)
})
export class ProfilesModule {}
