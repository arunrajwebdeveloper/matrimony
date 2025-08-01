import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
// import { RolesGuard } from '../auth/roles.guard'; // Assuming you have a RolesGuard
// import { Roles } from '../auth/roles.decorator'; // Assuming you have a Roles decorator

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // --- Admin Endpoints for managing plans ---
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin')
  @Post('plans')
  @ApiOperation({ summary: 'Create a new subscription plan (Admin only)' })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription plan created.',
  })
  @ApiBody({ type: CreateSubscriptionPlanDto })
  async createPlan(@Body() createPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionsService.createPlan(createPlanDto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get all active subscription plans' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active subscription plans retrieved.',
  })
  async getAllPlans() {
    return this.subscriptionsService.findAllPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get a subscription plan by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription plan retrieved.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Plan not found.' })
  async getPlanById(@Param('id') id: string) {
    return this.subscriptionsService.findPlanById(id);
  }

  // --- User Endpoints for managing their subscriptions ---
  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a subscription plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subscription purchased successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid plan or already subscribed.',
  })
  @ApiBody({ type: PurchaseSubscriptionDto })
  async purchaseSubscription(
    @Request() req,
    @Body() purchaseDto: PurchaseSubscriptionDto,
  ) {
    return this.subscriptionsService.purchaseSubscription(
      req.user._id,
      purchaseDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-subscription')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the authenticated user's active subscription" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Active subscription retrieved.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active subscription found.',
  })
  async getMySubscription(@Request() req) {
    return this.subscriptionsService.getUserActiveSubscription(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cancel')
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Cancel the authenticated user's active subscription",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subscription cancelled successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'No active subscription found to cancel.',
  })
  async cancelMySubscription(@Request() req) {
    return this.subscriptionsService.cancelSubscription(req.user._id);
  }
}
