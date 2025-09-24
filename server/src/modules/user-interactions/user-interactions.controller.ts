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
} from '@nestjs/common';
import { UserInteractionsService } from './user-interactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-interactions')
@UseGuards(JwtAuthGuard)
export class UserInteractionsController {
  constructor(private interactionsService: UserInteractionsService) {}

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
  @Post('match-request/:userId')
  async sendMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.sendMatchRequest(req.user._id, userId);
  }

  @Post('match-request/accept/:userId')
  async acceptMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.acceptMatchRequest(req.user._id, userId);
  }

  @Post('match-request/decline/:userId')
  async declineMatchRequest(@Req() req: any, @Param('userId') userId: string) {
    return this.interactionsService.declineMatchRequest(req.user._id, userId);
  }

  @Get('match-requests/pending')
  async getPendingMatchRequests(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getPendingMatchRequests(
      req.user._id,
      page,
      limit,
    );
  }

  @Get('match-requests/sent')
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
  async getMatches(
    @Req() req: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.interactionsService.getMatches(req.user._id, page, limit);
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

  @Get('summary')
  async getUserInteractionSummary(@Req() req: any) {
    return this.interactionsService.getUserInteractionSummary(req.user._id);
  }

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
