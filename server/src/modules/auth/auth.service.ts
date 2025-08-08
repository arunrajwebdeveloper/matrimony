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

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ user: UserDocument }> {
    const { email, password, fullName, gender, dateOfBirth } = registerUserDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await this.usersService.create({
      email,
      passwordHash,
      fullName,
      gender,
      dateOfBirth: new Date(dateOfBirth),
    });

    // Check if the newUser object has a valid _id before proceeding.
    if (!newUser || !newUser._id) {
      throw new BadRequestException(
        'Failed to create user and get a valid ID.',
      );
    }

    const newProfile = await this.profilesService.create({
      user: newUser._id as Types.ObjectId,
      firstName: fullName.split(' ')[0] || '',
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      gender: newUser.gender,
      dateOfBirth: newUser.dateOfBirth,
      religion: 'Not Specified',
      motherTongue: 'Not Specified',
      height: 0,
      weight: 0,
      complexion: 'Fair',
      bodyType: 'Average',
      disabilityStatus: 'No Disability',
      aboutMe: 'A new member looking for a partner.',
      phoneNumber: '',
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
      profilePicture: '',
      partnerPreferences: {},
      verification: {
        phone: false,
        email: false,
        id: false,
        profileReview: 'pending',
      },
    });

    newUser.profile = newProfile?._id?.toString();
    await newUser.save();

    this.eventEmitter.emit('user.created', {
      userId: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
    });

    return {
      user: newUser,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<{
    user: UserDocument;
    accessToken: string;
    refreshToken: string;
  }> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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
    return { user, accessToken, refreshToken };
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
}
