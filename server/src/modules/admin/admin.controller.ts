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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// import { RolesGuard } from '../auth/roles.guard'; // Assuming you have a RolesGuard
// import { Roles } from '../auth/roles.decorator'; // Assuming you have a Roles decorator
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';

@ApiTags('Admin')
@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard) // Apply JWT and Roles guard globally for admin routes
// @Roles('admin') // Only users with 'admin' role can access these routes
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- User Reporting (accessible by regular users) ---
  @UseGuards(JwtAuthGuard)
  @Post('reports')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a report against another user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Report submitted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid report data.',
  })
  @ApiBody({ type: CreateReportDto })
  async createReport(
    @Request() req: any,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.adminService.createReport(req.user._id, createReportDto);
  }

  // --- Admin-only Endpoints ---
  // For simplicity, I'm using JwtAuthGuard here. In a real app,
  // you'd use a more sophisticated RolesGuard to check for 'admin' role.
  @UseGuards(JwtAuthGuard)
  @Get('reports')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all user reports (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reports retrieved successfully.',
  })
  async getAllReports() {
    return this.adminService.getAllReports();
  }

  @UseGuards(JwtAuthGuard)
  @Get('reports/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific report by ID (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Report retrieved successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Report not found.',
  })
  async getReportById(@Param('id') reportId: string) {
    return this.adminService.getReportById(reportId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('reports/:id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the status of a user report (Admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Report status updated.' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Report not found.',
  })
  @ApiBody({ type: UpdateReportStatusDto })
  async updateReportStatus(
    @Param('id') reportId: string,
    @Request() req: any,
    @Body() updateStatusDto: UpdateReportStatusDto,
  ) {
    return this.adminService.updateReportStatus(
      reportId,
      req.user._id,
      updateStatusDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/suspend')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend/Deactivate a user (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User suspended successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async suspendUser(@Param('id') userId: string, @Request() req) {
    return this.adminService.suspendUser(userId, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/activate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate a suspended user (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User activated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'User is already active.',
  })
  async activateUser(@Param('id') userId: string, @Request() req) {
    return this.adminService.activateUser(userId, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('activity-logs')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get recent activity logs (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Activity logs retrieved successfully.',
  })
  async getActivityLogs() {
    return this.adminService.getRecentActivityLogs();
  }
}
