import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
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
}
