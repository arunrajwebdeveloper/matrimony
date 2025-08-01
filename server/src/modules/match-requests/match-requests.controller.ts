import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { MatchRequestsService } from './match-requests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMatchRequestDto } from './dto/create-match-request.dto';
import { RespondMatchRequestDto } from './dto/respond-match-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Match Requests')
@Controller('match-requests')
export class MatchRequestsController {
  constructor(private readonly matchRequestsService: MatchRequestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send a new match request' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Match request sent successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or already sent.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Recipient not found.',
  })
  @ApiBody({ type: CreateMatchRequestDto })
  async sendRequest(
    @Request() req,
    @Body() createMatchRequestDto: CreateMatchRequestDto,
  ) {
    return this.matchRequestsService.sendRequest(
      req.user._id,
      createMatchRequestDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('sent')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all match requests sent by the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sent match requests retrieved successfully.',
  })
  async getSentRequests(@Request() req) {
    return this.matchRequestsService.getSentRequests(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('received')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all match requests received by the authenticated user',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Received match requests retrieved successfully.',
  })
  async getReceivedRequests(@Request() req) {
    return this.matchRequestsService.getReceivedRequests(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/respond')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Respond to a received match request (accept/reject)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Match request responded to successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Match request not found or not pending.',
  })
  @ApiBody({ type: RespondMatchRequestDto })
  async respondToRequest(
    @Param('id') requestId: string,
    @Request() req,
    @Body() respondDto: RespondMatchRequestDto,
  ) {
    return this.matchRequestsService.respondToRequest(
      requestId,
      req.user._id,
      respondDto.action,
    );
  }
}
