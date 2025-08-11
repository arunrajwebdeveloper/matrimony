import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
  Body,
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

@ApiTags('Matches')
@ApiBearerAuth()
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('preferred')
  @ApiOperation({ summary: 'Get preferred matches based on user preferences' })
  @ApiResponse({
    status: 200,
    description: 'List of profiles matching preferences',
    type: [ProfileDto],
  })
  async getPreferredMatches(@Req() req) {
    // req.user.id would come from a real authentication guard
    return this.matchesService.getPreferredMatches(req.user.id);
  }

  @Get('new')
  @ApiOperation({ summary: 'Get new matches not yet interacted with' })
  @ApiResponse({
    status: 200,
    description: 'List of new profiles',
    type: [ProfileDto],
  })
  async getNewMatches(@Req() req) {
    return this.matchesService.getNewMatches(req.user.id);
  }

  @Get('shortlist')
  @ApiOperation({ summary: 'Get profiles currently in the user’s shortlist' })
  @ApiResponse({
    status: 200,
    description: 'List of shortlisted profiles',
    type: [ProfileDto],
  })
  async getShortlistedProfiles(@Req() req) {
    return this.matchesService.getShortlistedProfiles(req.user.id);
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
  async addShortlist(@Req() req, @Param('profileId') profileId: string) {
    return this.matchesService.updateShortlist(req.user.id, profileId, 'add');
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
  async removeShortlist(@Req() req, @Param('profileId') profileId: string) {
    return this.matchesService.updateShortlist(
      req.user.id,
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
  async declineProfile(@Req() req, @Param('profileId') profileId: string) {
    return this.matchesService.declineProfile(req.user.id, profileId);
  }

  @Get('declined')
  @ApiOperation({ summary: 'Get profiles the user has declined' })
  @ApiResponse({
    status: 200,
    description: 'List of declined profiles',
    type: [ProfileDto],
  })
  async getDeclinedProfiles(@Req() req) {
    return this.matchesService.getDeclinedProfiles(req.user.id);
  }
}
