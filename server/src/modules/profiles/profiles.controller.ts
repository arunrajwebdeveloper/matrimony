import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  HttpStatus,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SearchProfilesDto } from './dto/search-profiles.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { SignedUrlInterceptor } from 'src/common/interceptors/signed-url.interceptor';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SignedUrlInterceptor) // Auto generate signed url
  @Get('my-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the authenticated user's own profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  async getMyProfile(@Request() req: any) {
    // req.user.profileId is set by JwtStrategy
    const profile = await this.profilesService.findUserProfile(
      req.user.profileId?.toString(),
      // req.user._id,
    );
    if (!profile) {
      return { message: 'Profile not found.' }; // This should ideally not happen after successful registration
    }
    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('my-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update the authenticated user's own profile" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
  })
  @ApiBody({ type: UpdateProfileDto })
  async updateMyProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update(req.user._id, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SignedUrlInterceptor)
  @Get(':profileId')
  @ApiOperation({ summary: 'Get a public profile by profileId' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found or not public.',
  })
  async getProfileByprofileId(
    @Request() req: any,
    @Param('profileId') profileId: string,
  ) {
    const profile = await this.profilesService.findUserProfile(
      profileId.toString(),
      // req.user._id,
    );
    if (!profile || profile.visibility !== 'public' || profile.deletedAt) {
      throw new NotFoundException('Profile not found or not accessible.');
    }
    return profile;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a public profile by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Profile not found or not public.',
  })
  async getProfileById(@Param('id') id: string) {
    const profile = await this.profilesService.findById(id);
    if (!profile || profile.visibility !== 'public' || profile.deletedAt) {
      throw new NotFoundException('Profile not found or not accessible.');
    }
    return profile;
  }

  @Get()
  @ApiOperation({ summary: 'Search for profiles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profiles retrieved successfully.',
  })
  @ApiQuery({ name: 'gender', required: false, enum: ['Male', 'Female'] })
  @ApiQuery({ name: 'minAge', required: false, type: Number })
  @ApiQuery({ name: 'maxAge', required: false, type: Number })
  @ApiQuery({ name: 'religion', required: false, type: String })
  @ApiQuery({ name: 'community', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({
    name: 'maritalStatus',
    required: false,
    enum: ['Never Married', 'Divorced', 'Widowed', 'Annulled'],
  })
  @ApiQuery({ name: 'educationLevel', required: false, type: String })
  @ApiQuery({ name: 'minIncome', required: false, type: Number })
  @ApiQuery({ name: 'diet', required: false, type: String })
  @ApiQuery({ name: 'disabilityStatus', required: false, type: String })
  @ApiQuery({ name: 'isPremium', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  async searchProfiles(@Query() searchDto: SearchProfilesDto) {
    return this.profilesService.search(searchDto);
  }
}
