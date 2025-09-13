import { forwardRef, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('SIGNED_URL_SECRET'),
        signOptions: {
          expiresIn: configService.get<string | number>(
            'UPLOAD_TOKEN_EXPIRES',
            '24h',
          ),
        },
      }),
    }),
    ConfigModule,
    forwardRef(() => UsersModule), // 👈 handle circular dep
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
