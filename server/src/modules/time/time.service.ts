import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  getCurrentHour() {
    const now = new Date();
    const hour = now.getUTCHours();
    return { hour };
  }
}
