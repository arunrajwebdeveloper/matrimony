import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';

@Injectable()
export class UploadService {
  private readonly baseUrl: string;
  private readonly expiresInSeconds: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'BASE_URL',
      'http://localhost:5050',
    );
    const expires = this.configService.get<string>(
      'UPLOAD_TOKEN_EXPIRES',
      '24h',
    );

    // Convert "2h" to seconds
    this.expiresInSeconds = this.parseExpiresIn(expires);
  }

  async generateSignedUrl(userId: string, filename: string, folder: string) {
    const token = this.jwtService.sign(
      { userId, filename, folder },
      { expiresIn: this.expiresInSeconds },
    );

    return {
      signedUrl: `${this.baseUrl}/api/upload/file/${folder}/${filename}?token=${token}`,
      expiresIn: 24 * 60 * 60, // 2 hours in seconds
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

  private parseExpiresIn(value: string): number {
    // supports "2h", "30m", "10s"
    const unit = value.slice(-1);
    const num = parseInt(value.slice(0, -1), 10);
    if (unit === 'h') return num * 3600;
    if (unit === 'm') return num * 60;
    if (unit === 's') return num;
    return parseInt(value, 10); // fallback if number only
  }
}
