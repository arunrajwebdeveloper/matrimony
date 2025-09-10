import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ProfilesService } from '../profiles/profiles.service';
import { UserDocument } from '../users/schemas/user.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenDocument } from './schemas/refresh-token.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  // GENERATE USERNAME AND PROFILEID

  private async generateUniqueIds(): Promise<{ profileId: string }> {
    let isUnique = false;
    let profileId = '';

    while (!isUnique) {
      const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
      profileId = `MW-${randomNum}`;

      const existing = await this.usersService.findByProfileId(profileId);

      if (!existing) {
        isUnique = true;
      }
    }

    return { profileId };
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ message: string }> {
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      phoneNumber,
    } = registerUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { profileId } = await this.generateUniqueIds();

    if (!profileId) {
      throw new Error('Failed to generate unique IDs');
    }

    const newUser = await this.usersService.create({
      email,
      passwordHash,
      firstName,
      lastName,
      gender,
      profileId,
      dateOfBirth: new Date(dateOfBirth),
      phoneNumber,
    });

    // Check if the newUser object has a valid _id before proceeding.
    if (!newUser || !newUser._id) {
      throw new BadRequestException(
        'Failed to create user and get a valid ID.',
      );
    }

    const newProfile = await this.profilesService.create({
      user: newUser?._id as Types.ObjectId,
      firstName,
      lastName,
      profileId: newUser?.profileId,
      gender: newUser?.gender,
      dateOfBirth: newUser?.dateOfBirth,
      phoneNumber: newUser?.phoneNumber,
      email: newUser?.email,
      religion: 'Not Specified',
      motherTongue: 'Not Specified',
      height: 0,
      weight: 0,
      complexion: 'Fair',
      bodyType: 'Average',
      disabilityStatus: 'No Disability',
      aboutMe: 'A new member looking for a partner.',
      country: 'Not Specified',
      state: 'Not Specified',
      city: 'Not Specified',
      residencyStatus: 'Not Specified',
      familyType: 'Nuclear',
      familyStatus: 'Middle Class',
      fatherOccupation: 'Not Specified',
      motherOccupation: 'Not Specified',
      brothers: 0,
      sisters: 0,
      brothersMarried: 0,
      sistersMarried: 0,
      familyValues: 'Moderate',
      educationLevel: 'Not Specified',
      educationField: 'Not Specified',
      occupation: 'Not Specified',
      annualIncome: 0,
      diet: 'Vegetarian',
      smokingHabit: 'No',
      drinkingHabit: 'No',
      maritalStatus: 'Never Married',
      profilePhotos: [],
      profilePicture: null,
      partnerPreferences: {},
      verification: {
        phone: false,
        email: false,
        id: false,
        profileReview: 'pending',
      },
    });

    newUser.profile = newProfile?._id as Types.ObjectId;
    await newUser.save();

    this.eventEmitter.emit('user.created', {
      userId: newUser?._id,
      email: newUser?.email,
      firstName: newUser?.firstName,
    });

    return {
      message: 'User registered successfully',
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.lastLogin = new Date();
    await user.save();

    // Fix: Explicitly cast _id to a string to satisfy TypeScript.
    const profile = await this.profilesService.findByUserId(
      user?._id?.toString(),
    );
    const profileId = profile ? profile._id : null;

    const payload = { email: user.email, sub: user._id, profileId: profileId };
    const accessToken = await this.jwtService.signAsync(payload);

    const refreshTokenExpiresIn = parseInt(
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '604800',
      10,
    );
    const refreshToken = await this.createRefreshToken(
      user?._id?.toString() ?? '',
      refreshTokenExpiresIn,
    );

    this.logger.log(`User ${user._id} logged in. Tokens generated.`);
    return { accessToken, refreshToken };
  }

  async createRefreshToken(userId: string, expiresIn: number): Promise<string> {
    return this.refreshTokenService.createToken(userId, expiresIn);
  }

  async findRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument | null> {
    return this.refreshTokenService.findRefreshToken(refreshToken);
  }

  async validateUser(payload: any) {
    return this.usersService.findById(payload.sub);
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    const tokenRecord = await this.refreshTokenService.findToken(refreshToken);
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    await this.refreshTokenService.revokeToken(refreshToken);

    const user = await this.usersService.findById(
      tokenRecord?.userId?.toString(),
    );

    if (!user || user.deletedAt) {
      await this.refreshTokenService.revokeAllUserTokens(
        tokenRecord.userId?.toString(),
      );
      throw new UnauthorizedException('User not found or deactivated.');
    }

    // Fix: Explicitly cast _id to a string to satisfy TypeScript.
    const profile = await this.profilesService.findByUserId(
      user?._id?.toString(),
    );

    const profileId = profile ? profile._id : null;

    const payload = { email: user.email, sub: user._id, profileId };
    const newAccessToken = await this.jwtService.signAsync(payload);

    return newAccessToken;
  }

  async revokeToken(refreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeToken(refreshToken);
  }

  async changePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newPasswordHash;
    await user.save();

    this.eventEmitter.emit('user.passwordChanged', {
      userId: user._id,
      email: user.email,
    });
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // Always return a generic success message to prevent email enumeration
      return { message: 'If an account exists, a reset link has been sent.' };
    }

    const resetToken = randomUUID();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token valid for 1 hour
    await user.save();

    // Send email containing the reset link:
    const CLIENT_URL =
      this.configService.get<string>('CLIENT_URL') || 'http://localhost:3000';
    const resetUrl = `${CLIENT_URL!}/reset-password?token=${resetToken}`;
    this.eventEmitter.emit('user.forgotPassword', {
      email: user.email,
      resetUrl,
    });

    return { message: 'Password reset link sent successfully.' };
  }

  async resetPassword(token: string, password: any) {
    const user = await this.usersService.findByResetPasswordToken(token);
    if (!user) {
      throw new BadRequestException('Invalid or expired token.');
    }

    // Hash the new password and save
    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null; // Clear the token
    user.resetPasswordExpires = null; // Clear expiration time
    await user.save();

    this.eventEmitter.emit('user.resetPassword', {
      email: user.email,
    });

    return { message: 'Password has been reset successfully.' };
  }
}
