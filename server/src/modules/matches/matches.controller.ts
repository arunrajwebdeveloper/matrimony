import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  Body,
  UseGuards,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { MatchesService } from './matches.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SignedUrlInterceptor } from '../../common/interceptors/signed-url.interceptor';

@UseGuards(JwtAuthGuard)
@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @UseInterceptors(SignedUrlInterceptor)
  @Get('preferred')
  @ApiOperation({ summary: 'Get preferred matches based on user preferences' })
  @ApiResponse({
    status: 200,
    description: 'List of profiles matching preferences',
    type: [ProfileDto],
  })
  async getPreferredMatches(
    @Req() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    // req.user._id would come from a real authentication guard
    return this.matchesService.getPreferredMatches(req.user._id, page, limit);
  }

  @UseInterceptors(SignedUrlInterceptor)
  @Get('new')
  @ApiOperation({ summary: 'Get new matches not yet interacted with' })
  @ApiResponse({
    status: 200,
    description: 'List of new profiles',
    type: [ProfileDto],
  })
  async getNewMatches(
    @Req() req: any,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.matchesService.getNewMatches(req.user._id, page, limit);
  }

  @UseInterceptors(SignedUrlInterceptor)
  @Get('shortlist')
  @ApiOperation({ summary: 'Get profiles currently in the user’s shortlist' })
  @ApiResponse({
    status: 200,
    description: 'List of shortlisted profiles',
    type: [ProfileDto],
  })
  async getShortlistedProfiles(@Req() req: any) {
    return this.matchesService.getShortlistedProfiles(req.user._id);
  }

  @Post('shortlist/:profileId')
  @ApiOperation({ summary: 'Add a profile to the user’s shortlist' })
  @ApiParam({
    name: 'profileId',
    description: 'The ID of the profile to shortlist',
  })
  @ApiResponse({
    status: 201,
    description: 'Profile successfully added to shortlist',
  })
  async addShortlist(@Req() req: any, @Param('profileId') profileId: string) {
    return this.matchesService.updateShortlist(req.user._id, profileId, 'add');
  }

  @Delete('shortlist/:profileId')
  @ApiOperation({ summary: 'Remove a profile from the user’s shortlist' })
  @ApiParam({
    name: 'profileId',
    description: 'The ID of the profile to remove',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile successfully removed from shortlist',
  })
  async removeShortlist(
    @Req() req: any,
    @Param('profileId') profileId: string,
  ) {
    return this.matchesService.updateShortlist(
      req.user._id,
      profileId,
      'remove',
    );
  }

  @Post('decline/:profileId')
  @ApiOperation({ summary: 'Decline a profile' })
  @ApiParam({
    name: 'profileId',
    description: 'The ID of the profile to decline',
  })
  @ApiResponse({ status: 201, description: 'Profile successfully declined' })
  async declineProfile(@Req() req: any, @Param('profileId') profileId: string) {
    return this.matchesService.declineProfile(req.user._id, profileId);
  }

  @UseInterceptors(SignedUrlInterceptor)
  @Get('declined')
  @ApiOperation({ summary: 'Get profiles the user has declined' })
  @ApiResponse({
    status: 200,
    description: 'List of declined profiles',
    type: [ProfileDto],
  })
  async getDeclinedProfiles(@Req() req: any) {
    return this.matchesService.getDeclinedProfiles(req.user._id);
  }
}
