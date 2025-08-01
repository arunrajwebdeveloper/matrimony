import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import {
  ActivityLog,
  ActivityLogDocument,
} from './schemas/activity-log.schema';
import { UsersService } from '../users/users.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter2

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(ActivityLog.name)
    private activityLogModel: Model<ActivityLogDocument>,
    private usersService: UsersService,
    private profilesService: ProfilesService,
    private eventEmitter: EventEmitter2, // Inject EventEmitter2
  ) {}

  // --- Report Management ---
  async createReport(
    reporterId: Types.ObjectId,
    createReportDto: CreateReportDto,
  ): Promise<ReportDocument> {
    const { reportedUserId, reason, description } = createReportDto;

    // Ensure reported user exists
    const reportedUser = await this.usersService.findById(reportedUserId);
    if (!reportedUser) {
      throw new NotFoundException('Reported user not found.');
    }

    // Prevent self-reporting
    if (reporterId.toString() === reportedUserId.toString()) {
      throw new BadRequestException('Cannot report yourself.');
    }

    const newReport = new this.reportModel({
      reporter: reporterId,
      reportedUser: new Types.ObjectId(reportedUserId),
      reason,
      description,
      status: 'pending',
    });
    const savedReport = await newReport.save();

    // Emit event for new report
    this.eventEmitter.emit('admin.newReport', {
      reportId: savedReport._id,
      reporterId: savedReport.reporter,
      reportedUserId: savedReport.reportedUser,
      reason: savedReport.reason,
    });

    return savedReport;
  }

  async getAllReports(): Promise<ReportDocument[]> {
    return this.reportModel
      .find({ deletedAt: null })
      .populate('reporter', 'email fullName')
      .populate('reportedUser', 'email fullName')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReportById(reportId: string): Promise<ReportDocument> {
    const report = await this.reportModel
      .findById(reportId)
      .populate('reporter', 'email fullName')
      .populate('reportedUser', 'email fullName')
      .exec();
    if (!report || report.deletedAt) {
      throw new NotFoundException('Report not found.');
    }
    return report;
  }

  async updateReportStatus(
    reportId: string,
    adminId: Types.ObjectId,
    updateStatusDto: UpdateReportStatusDto,
  ): Promise<ReportDocument> {
    const { status } = updateStatusDto;
    const report = await this.reportModel.findById(reportId).exec();

    if (!report || report.deletedAt) {
      throw new NotFoundException('Report not found.');
    }

    report.status = status;
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();
    await report.save();

    // Optionally, trigger actions based on status (e.g., suspend user if action_taken)
    if (status === 'action_taken') {
      // Example: Suspend the reported user
      await this.usersService.softDelete(report.reportedUser); // Or a specific suspend method
      await this.profilesService.softDelete(report.reportedUser); // Deactivate profile
      this.eventEmitter.emit('user.suspended', {
        userId: report.reportedUser,
        adminId: adminId,
      });
    }

    // Emit event for report status update
    this.eventEmitter.emit('admin.reportStatusUpdated', {
      reportId: report._id,
      status: report.status,
      reviewedBy: adminId,
      reportedUserId: report.reportedUser,
    });

    return report;
  }

  // --- User Management (Admin Actions) ---
  async suspendUser(userId: string, adminId: Types.ObjectId): Promise<any> {
    const user = await this.usersService.softDelete(userId); // Mark user as deleted/deactivated
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    await this.profilesService.softDelete(userId); // Deactivate associated profile

    await this.logActivity(adminId, 'ADMIN_SUSPEND_USER', {
      userId: user._id,
      email: user.email,
    });
    this.eventEmitter.emit('user.suspended', {
      userId: user._id,
      adminId: adminId,
    });
    return { message: `User ${user.email} suspended successfully.` };
  }

  async activateUser(userId: string, adminId: Types.ObjectId): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!user.deletedAt) {
      throw new BadRequestException('User is already active.');
    }

    // Revert soft delete and status
    user.deletedAt = null;
    user.status = 'active';
    await user.save();

    const profile = await this.profilesService.findByUserId(userId);
    if (profile) {
      profile.deletedAt = null;
      profile.visibility = 'public'; // Or previous visibility
      await profile.save();
    }

    await this.logActivity(adminId, 'ADMIN_ACTIVATE_USER', {
      userId: user._id,
      email: user.email,
    });
    this.eventEmitter.emit('user.activated', {
      userId: user._id,
      adminId: adminId,
    });
    return { message: `User ${user.email} activated successfully.` };
  }

  // --- Activity Logging ---
  async logActivity(
    userId: Types.ObjectId | null,
    action: string,
    details: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLogDocument> {
    const newLog = new this.activityLogModel({
      user: userId,
      action,
      details,
      ipAddress,
      userAgent,
    });
    return newLog.save();
  }

  async getRecentActivityLogs(
    limit: number = 50,
  ): Promise<ActivityLogDocument[]> {
    return this.activityLogModel
      .find({})
      .populate('user', 'email fullName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
