import { forwardRef, Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: '3432423rf5r3c3534534534c5345c345345c35345c435',
      signOptions: { expiresIn: '2h' },
    }),
    forwardRef(() => UsersModule), // 👈 handle circular dep
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
