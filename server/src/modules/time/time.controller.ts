import { Controller, Get, Query } from '@nestjs/common';
import { TimeService } from './time.service';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get('current-datetime')
  getCurrentHour(@Query('tz') tz: string) {
    const timezone = tz || 'UTC';
    return this.timeService.getCurrentDateTime(timezone);
  }
}
