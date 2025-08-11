import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import {
  RefreshTokenDocument,
  RefreshToken,
} from './schemas/refresh-token.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokenService {
  private readonly logger = new Logger(RefreshTokenService.name);

  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  /**
   * Creates a new refresh token and saves it to the database.
   * @param userId The ID of the user the token belongs to.
   * @param expiresIn The time in seconds until the token expires.
   * @returns The newly created refresh token string.
   */
  async createToken(userId: string, expiresIn: number): Promise<string> {
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    const newRefreshToken = new this.refreshTokenModel({
      token,
      userId: new Types.ObjectId(userId), // Ensure userId is a Mongoose ObjectId
      expiresAt,
    });

    await newRefreshToken.save();
    this.logger.log(`Created refresh token for user ${userId}`);
    return token;
  }

  async findRefreshToken(token: string): Promise<RefreshTokenDocument | null> {
    const tokenRecord = await this.refreshTokenModel.findOne({
      token,
    });
    return tokenRecord;
  }

  /**
   * Finds a refresh token in the database.
   * @param token The refresh token string to find.
   * @returns The RefreshTokenDocument or null if not found.
   */
  async findToken(token: string): Promise<RefreshTokenDocument | null> {
    const tokenRecord = await this.refreshTokenModel.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });
    if (!tokenRecord) {
      this.logger.warn(`Invalid or expired refresh token: ${token}`);
    }
    return tokenRecord;
  }

  /**
   * Revokes a specific refresh token from the database.
   * @param token The refresh token string to revoke.
   */
  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenModel.deleteOne({ token });
    this.logger.log(`Revoked refresh token: ${token}`);
  }

  /**
   * Revokes all refresh tokens for a given user from the database.
   * @param userId The ID of the user whose tokens should be revoked.
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      userId: new Types.ObjectId(userId),
    });
    this.logger.log(`Revoked all refresh tokens for user ${userId}`);
  }
}
