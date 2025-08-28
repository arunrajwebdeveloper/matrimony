import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current authenticated user details with profile',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User and profile data retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async getMe(@Request() req: any) {
    // req.user is populated by JwtStrategy
    const user = await this.usersService.findByIdWithProfile(req.user._id);
    if (!user) {
      return { message: 'User not found.' }; // Should not happen if guard passed
    }
    return user;
  }

  @Patch('profile-picture')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update user profile picture',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile picture updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async updateProfilePicture(
    @Request() req: any,
    @Body('filename') filename: string,
  ) {
    if (!filename) return { message: 'File not found.' };

    const user = await this.usersService.updateProfilePicture(
      req.user._id,
      filename,
    );
    if (!user) {
      return { message: 'User not found.' };
    }
    return { message: 'Profile picture updated successfully' };
  }
}
