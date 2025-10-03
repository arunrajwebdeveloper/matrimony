import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter'; // Import EventEmitterModule
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { ChatModule } from './modules/chat/chat.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmailModule } from './modules/email/email.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { UploadModule } from './modules/upload/upload.module';
import { UserInteractionsModule } from './modules/user-interactions/user-interactions.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    // MongoDB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // Event Emitter for decoupled event handling
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    ProfilesModule,
    ChatModule,
    SubscriptionsModule,
    AdminModule,
    EmailModule,
    ActivitiesModule,
    UploadModule,
    UserInteractionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
