import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserInteractionsService } from './user-interactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileResponseDto } from './dto/profileResponseDto';
import { SignedUrlInterceptor } from 'src/common/interceptors/signed-url.interceptor';

@Controller('user-interactions')
@UseInterceptors(SignedUrlInterceptor)
@UseGuards(JwtAuthGuard)
export class UserInteractionsController {
  constructor(private interactionsService: UserInteractionsService) {}

  // MATCHES
  @Get('preferred')
  @ApiOperation({ summary: 'Get preferred matches based on user preferences' })
  @ApiResponse({
    status: 200,
    description: 'List of profiles matching preferences',
    type: [ProfileResponseDto],
  })
  async getPreferredMatches(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    // req.user._id would come from a real authentication guard
    return this.interactionsService.getPreferredMatches(
      req.user._id,
      page,
      limit,
    );
  }

  @Get('new')
  @ApiOperation({ summary: 'Get new matches not yet interacted with' })
  @ApiResponse({
    status: 200,
    description: 'List of new profiles',
    type: [ProfileResponseDto],
  })
  async getNewMatches(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getNewMatches(req.user._id, page, limit);
  }

  // SHORTLIST ENDPOINTS
  @Post('shortlist/:userId')
  async shortlistUser(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.addToShortlist(req.user._id, userId);
  }

  @Post('shortlist/remove/:userId')
  async removeFromShortlist(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.removeFromShortlist(req.user._id, userId);
  }

  @Get('shortlisted')
  async getShortlisted(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getShortlisted(req.user._id, page, limit);
  }

  // IGNORE ENDPOINTS

  @Post('ignore/:userId')
  async ignoreUser(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.ignoreUser(req.user._id, userId);
  }

  // BLOCK ENDPOINTS
  @Post('block/:userId')
  async blockUser(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.blockUser(req.user._id, userId);
  }

  @Post('block/remove/:userId')
  async unblockUser(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.unblockUser(req.user._id, userId);
  }

  @Get('blocked')
  async getBlocked(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getBlocked(req.user._id, page, limit);
  }

  // MATCH REQUEST ENDPOINTS
  @Post('request/send/:userId')
  async sendMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.sendMatchRequest(req.user._id, userId);
  }

  @Post('request/accept/:userId')
  async acceptMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.acceptMatchRequest(req.user._id, userId);
  }

  @Post('request/decline/:userId')
  async declineMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.declineMatchRequest(req.user._id, userId);
  }

  @Post('request/cancel/:userId')
  async cancelMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.cancelMatchRequest(req.user._id, userId);
  }

  @Get('request/pending')
  async getReceivedMatchRequests(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getReceivedMatchRequests(
      req.user._id,
      page,
      limit,
    );
  }

  @Post('decline/remove/:userId')
  async removeFromDeclinedlist(
    @Req() req: any,
    @Param('userId') userId: string,
  ) {
    return this.interactionsService.removeFromDeclinedlist(
      req.user._id,
      userId,
    );
  }

  @Post('accepted/remove/:userId')
  async removeFromAcceptedlist(
    @Req() req: any,
    @Param('userId') userId: string,
  ) {
    return this.interactionsService.removeFromAcceptedlist(
      req.user._id,
      userId,
    );
  }

  @Get('declined')
  async getDeclined(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getDeclined(req.user._id, page, limit);
  }

  @Get('request/sent')
  async getSentMatchRequests(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getSentMatchRequests(
      req.user._id,
      page,
      limit,
    );
  }

  @Get('accepted-requests')
  async getAcceptedRequests(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getAcceptedRequests(
      req.user._id,
      page,
      limit,
    );
  }

  // PROFILE VIEW ENDPOINTS
  @Post('view/:userId')
  async recordProfileView(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.recordProfileView(req.user._id, userId);
  }

  @Get('recent-views')
  async getRecentViews(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getRecentViews(req.user._id, page, limit);
  }

  // STATUS AND ANALYTICS ENDPOINTS
  @Get('status/:userId')
  async getRelationshipStatus(
    @Req() req: any,
    @Param('userId') userId: string,
  ) {
    return this.interactionsService.getRelationshipStatus(req.user._id, userId);
  }

  @Get('interaction-summary')
  async getUserInteractionSummary(@Req() req: any) {
    return this.interactionsService.getUserInteractionSummary(req.user._id);
  }

  // @Get('summary')
  // async getUserInteractionSummary(@Req() req: any) {
  //   return this.interactionsService.getUserInteractionSummary(req.user._id);
  // }

  @Get('history')
  async getInteractionHistory(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getInteractionHistory(
      req.user._id,
      page,
      limit,
    );
  }

  // @Get('stats')
  // async getInteractionStats(@Req() req:any) {
  //   return this.interactionsService.getInteractionStats(req.user._id);
  // }
}
