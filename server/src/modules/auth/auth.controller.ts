import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Put,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ConfigService } from '@nestjs/config'; // New import
import { Response } from 'express'; // New import for setting cookies
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard'; // Assume this guard exists
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User with this email already exists.',
  })
  @ApiBody({ type: RegisterUserDto })
  async register(@Body() registerUserDto: RegisterUserDto) {
    console.log('registerUserDto :>> ', registerUserDto);
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials.',
  })
  @ApiBody({ type: LoginUserDto })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginUserDto);

    const refreshTokenExpiresIn = parseInt(
      this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '604800',
      10,
    );

    res.cookie('refreshToken', refreshToken, {
      // Use httpOnly for XSS protection
      httpOnly: true,
      // Use secure in production to ensure HTTPS is used
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      // Set the path to the root so the cookie is available to auth endpoints
      path: '/api/auth',
      // Use SameSite for CSRF protection
      sameSite: 'lax',
      // Set a clear expiration time
      maxAge: refreshTokenExpiresIn * 1000,
    });

    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Use a refresh token to get a new access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token.',
  })
  async refresh(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found.');
    }

    try {
      const tokenRecord = await this.authService.findRefreshToken(refreshToken);
      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid or expired refresh token.');
      }

      const newAccessToken =
        await this.authService.getNewAccessToken(refreshToken);

      const refreshTokenExpiresIn = parseInt(
        this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '604800',
        10,
      );

      const newRefreshToken = await this.authService.createRefreshToken(
        tokenRecord?.userId?.toString(),
        refreshTokenExpiresIn,
      );

      res.cookie('refreshToken', newRefreshToken, {
        // Use httpOnly for XSS protection
        httpOnly: true,
        // Use secure in production to ensure HTTPS is used
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        // Set the path to the root so the cookie is available to auth endpoints
        path: '/api/auth',
        // Use SameSite for CSRF protection
        sameSite: 'lax',
        // Set a clear expiration time
        maxAge: refreshTokenExpiresIn * 1000,
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      res.clearCookie('refreshToken');
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and revoke refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful.',
  })
  async logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req?.cookies['refreshToken'];
    if (refreshToken) {
      await this.authService.revokeToken(refreshToken);
    }
    // Make sure to clear the cookie with the same path and other options
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logout successful.' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Change authenticated user's password" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password changed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(
      req.user._id,
      changePasswordDto.newPassword,
    );
    return { message: 'Password changed successfully.' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password request' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset link sent successfully.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() { email }: ForgotPasswordDto) {
    await this.authService.forgotPassword(email);
    return { message: 'Password reset link sent successfully.' };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successfully.',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() { token, password }: ResetPasswordDto) {
    await this.authService.resetPassword(token, password);
    return { message: 'Password reset link sent successfully.' };
  }
}
