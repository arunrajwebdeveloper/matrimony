import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
@Injectable()
export class TimeService {
  getCurrentDateTime(timezone: string) {
    try {
      const utcNow = DateTime.utc();
      const localTime = utcNow.setZone(timezone);

      return {
        utc: utcNow.toISO(),
        local: localTime.toISO(),
        hour: localTime.hour,
        timezone,
      };
    } catch (e) {
      return {
        error: 'Invalid timezone',
        utc: DateTime.utc().toISO(),
      };
    }
  }
}
