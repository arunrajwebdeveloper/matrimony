import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/report.schema';
import { ActivityLog, ActivityLogSchema } from './schemas/activity-log.schema';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module'; // For user management
import { ProfilesModule } from '../profiles/profiles.module'; // For profile management

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
    UsersModule,
    ProfilesModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
