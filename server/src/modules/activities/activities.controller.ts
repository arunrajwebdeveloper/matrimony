import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivityVerb } from './enums/activity-verb.enum';
import { SignedUrlInterceptor } from '../../common/interceptors/signed-url.interceptor';

interface LogActivityDto {
  verb: ActivityVerb;
  targetId: string;
}

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('log')
  async logActivity(@Body() body: LogActivityDto, @Request() req: any) {
    const viewedId = body.targetId;
    const actorId = req.user._id;

    // Validate the incoming 'verb' against the ActivityVerb enum.
    if (!Object.values(ActivityVerb).includes(body.verb)) {
      throw new HttpException(
        'Invalid activity verb provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.activitiesService.logActivity(actorId, body.verb, viewedId);
    return { success: true, message: 'Activity logged successfully.' };
  }

  @UseInterceptors(SignedUrlInterceptor)
  @Get('recent')
  async getRecentActivities(@Request() req: any) {
    const userId = req.user._id;
    return this.activitiesService.getRecentActivitiesForUser(userId);
  }

  @UseInterceptors(SignedUrlInterceptor)
  @Get('all')
  async getActivities(@Request() req: any) {
    const userId = req.user._id;
    return this.activitiesService.getActivitiesForUser(userId);
  }
}
