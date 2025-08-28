import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

@Injectable()
export class UploadService {
  constructor(private readonly jwtService: JwtService) {}

  async generateSignedUrl(userId: string, filename: string, folder: string) {
    const token = this.jwtService.sign(
      { userId, filename, folder },
      { expiresIn: '2h' }, // valid for 2 hours
    );

    return {
      signedUrl: `${process.env.BASE_URL!}/api/upload/file/${folder}/${filename}?token=${token}`,
      expiresIn: 2 * 60 * 60, // 2 hours in seconds
    };
  }

  async validateSignedUrl(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired signed URL');
    }
  }

  getFilePath(folder: string, filename: string): string {
    return join(process.cwd(), 'uploads', folder, filename);
  }
}
