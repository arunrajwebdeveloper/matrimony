import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActivityVerb } from './enums/activity-verb.enum';

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

  @Get('recent')
  async getRecentActivities(@Request() req: any) {
    const userId = req.user._id;

    return this.activitiesService.getRecentActivitiesForUser(userId);
  }

  @Get('all')
  async getActivities(@Request() req: any) {
    const userId = req.user._id;
    return this.activitiesService.getActivitiesForUser(userId);
  }
}
