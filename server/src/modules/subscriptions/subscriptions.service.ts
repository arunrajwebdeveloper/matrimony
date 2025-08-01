import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from './schemas/subscription-plan.schema';
import {
  UserSubscription,
  UserSubscriptionDocument,
} from './schemas/user-subscription.schema';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlanDocument>,
    @InjectModel(UserSubscription.name)
    private userSubscriptionModel: Model<UserSubscriptionDocument>,
    private usersService: UsersService,
  ) {}

  // --- Subscription Plans Management (Admin Only) ---
  async createPlan(
    createPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlanDocument> {
    const newPlan = new this.subscriptionPlanModel(createPlanDto);
    return newPlan.save();
  }

  async findAllPlans(): Promise<SubscriptionPlanDocument[]> {
    return this.subscriptionPlanModel.find({ isActive: true }).exec();
  }

  async findPlanById(id: string): Promise<SubscriptionPlanDocument> {
    const plan = await this.subscriptionPlanModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException(
        `Subscription plan with ID "${id}" not found.`,
      );
    }
    return plan;
  }

  // --- User Subscriptions ---
  async purchaseSubscription(
    userId: Types.ObjectId,
    purchaseDto: PurchaseSubscriptionDto,
  ): Promise<UserSubscriptionDocument> {
    const { planId, paymentTransactionId, autoRenew = false } = purchaseDto;

    const user = await this.usersService.findById(userId);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found.');
    }

    const plan = await this.findPlanById(planId);
    if (!plan || !plan.isActive) {
      throw new BadRequestException('Invalid or inactive subscription plan.');
    }

    // Check for existing active subscription
    const existingActiveSubscription = await this.userSubscriptionModel
      .findOne({
        user: userId,
        status: 'active',
      })
      .exec();

    if (existingActiveSubscription) {
      throw new BadRequestException('User already has an active subscription.');
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.durationInDays);

    const newSubscription = new this.userSubscriptionModel({
      user: userId,
      plan: plan._id,
      startDate,
      endDate,
      status: 'active',
      paymentTransactionId,
      autoRenew,
    });

    // In a real app, you'd integrate with a payment gateway here
    // and only proceed if payment is successful.

    const savedSubscription = await newSubscription.save();

    // Optionally, update the user's profile to reflect premium status
    // This would require injecting ProfilesService here and calling a method like profilesService.updatePremiumStatus(userId, true);

    return savedSubscription;
  }

  async getUserActiveSubscription(
    userId: Types.ObjectId,
  ): Promise<UserSubscriptionDocument | null> {
    return this.userSubscriptionModel
      .findOne({ user: userId, status: 'active' })
      .populate('plan')
      .exec();
  }

  async cancelSubscription(
    userId: Types.ObjectId,
  ): Promise<UserSubscriptionDocument> {
    const subscription = await this.userSubscriptionModel
      .findOneAndUpdate(
        { user: userId, status: 'active' },
        { $set: { status: 'cancelled', cancelledAt: new Date() } },
        { new: true },
      )
      .exec();

    if (!subscription) {
      throw new NotFoundException('No active subscription found to cancel.');
    }

    // Optionally, update the user's profile to reflect non-premium status
    // profilesService.updatePremiumStatus(userId, false);

    return subscription;
  }
}
