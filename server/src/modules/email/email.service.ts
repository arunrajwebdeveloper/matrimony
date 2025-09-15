import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Profile, ProfileDocument } from '../profiles/schemas/profile.schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';

@Injectable()
export class EmailService {
  private transporter: Mail;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
  ) {
    this.transporter = nodemailer.createTransport({
      // host: this.configService.get<string>('MAIL_HOST'),
      // port: this.configService.get<number>('MAIL_PORT'),
      // secure: this.configService.get<number>('MAIL_PORT') === 465, // true for 465, false for other ports
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ) {
    try {
      const templatePath = join(
        process.cwd(),
        'email-templates',
        `${templateName}.hbs`,
      );
      const source = readFileSync(templatePath, 'utf8');
      const compileTemplate = Handlebars.compile(source);

      // Render HTML
      const html = compileTemplate(context);

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>?/gm, ''), // plain text fallback
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }

  // @OnEvent('user.created')
  // async handleUserCreatedEvent(payload: {
  //   userId: string;
  //   email: string;
  //   firstName: string;
  // }) {
  //   const subject = 'Welcome to Matrimony App!';
  //   const html = `
  //     <p>Dear ${payload.firstName},</p>
  //     <p>Welcome to our Matrimony App! We are thrilled to have you join our community.</p>
  //     <p>Start building your profile and find your perfect match.</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(payload.email, subject, html);
  // }

  // @OnEvent('user.passwordChanged')
  // async handlePasswordChangedEvent(payload: { userId: string; email: string }) {
  //   const user = await this.userModel.findById(payload.userId).exec();
  //   if (!user) {
  //     this.logger.warn(
  //       `User not found for password change email: ${payload.userId}`,
  //     );
  //     return;
  //   }
  //   const subject = 'Your Password Has Been Changed';
  //   const html = `
  //     <p>Dear ${user.firstName || user.email},</p>
  //     <p>This is to confirm that your password for your Matrimony App account has been successfully changed.</p>
  //     <p>If you did not make this change, please contact our support team immediately.</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(payload.email, subject, html);
  // }

  // @OnEvent('profile.verifiedStatusUpdated')
  // async handleProfileVerifiedStatusUpdated(payload: {
  //   profileId: string;
  //   userId: string;
  //   status: 'approved' | 'rejected';
  // }) {
  //   const user = await this.userModel.findById(payload.userId).exec();
  //   if (!user) {
  //     this.logger.warn(
  //       `User not found for profile verification email: ${payload.userId}`,
  //     );
  //     return;
  //   }
  //   const subject = `Your Profile Verification Status: ${payload.status.toUpperCase()}`;
  //   let htmlContent = '';

  //   if (payload.status === 'approved') {
  //     htmlContent = `
  //       <p>Dear ${user.firstName || user.email},</p>
  //       <p>Great news! Your profile on our Matrimony App has been <strong>approved</strong>.</p>
  //       <p>Your profile is now fully visible to other members, increasing your chances of finding a match.</p>
  //       <p>Best regards,<br/>The Matrimony Team</p>
  //     `;
  //   } else if (payload.status === 'rejected') {
  //     htmlContent = `
  //       <p>Dear ${user.firstName || user.email},</p>
  //       <p>We regret to inform you that your profile on our Matrimony App has been <strong>rejected</strong> during our review process.</p>
  //       <p>This could be due to incomplete information, inappropriate content, or other reasons. Please log in to your account to review the details and make necessary corrections.</p>
  //       <p>If you believe this is a mistake or need assistance, please contact our support team.</p>
  //       <p>Best regards,<br/>The Matrimony Team</p>
  //     `;
  //   }
  //   await this.sendMail(user.email, subject, htmlContent);
  // }

  // @OnEvent('match.requestSent')
  // async handleMatchRequestSent(payload: {
  //   senderId: string;
  //   recipientId: string;
  // }) {
  //   const [sender, recipient] = await Promise.all([
  //     this.userModel.findById(payload.senderId).exec(),
  //     this.userModel.findById(payload.recipientId).exec(),
  //   ]);

  //   if (!sender || !recipient) {
  //     this.logger.warn(
  //       `Sender or recipient not found for match request email: Sender ${payload.senderId}, Recipient ${payload.recipientId}`,
  //     );
  //     return;
  //   }

  //   const subject = `New Match Request from ${sender.firstName || sender.email}`;
  //   const html = `
  //     <p>Dear ${recipient.firstName || recipient.email},</p>
  //     <p>You have received a new match request from <strong>${sender.firstName || sender.email}</strong>!</p>
  //     <p>Log in to your account to view their profile and respond to the request.</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(recipient.email, subject, html);
  // }

  // @OnEvent('match.accepted')
  // async handleMatchAccepted(payload: { user1Id: string; user2Id: string }) {
  //   const [user1, user2] = await Promise.all([
  //     this.userModel.findById(payload.user1Id).exec(),
  //     this.userModel.findById(payload.user2Id).exec(),
  //   ]);

  //   if (!user1 || !user2) {
  //     this.logger.warn(
  //       `One or both users not found for match accepted email: User1 ${payload.user1Id}, User2 ${payload.user2Id}`,
  //     );
  //     return;
  //   }

  //   // Notify user1
  //   const subject1 = `Congratulations! Your Match Request to ${user2.firstName || user2.email} was Accepted!`;
  //   const html1 = `
  //     <p>Dear ${user1.firstName || user1.email},</p>
  //     <p>Great news! Your match request to <strong>${user2.firstName || user2.email}</strong> has been accepted!</p>
  //     <p>You can now start chatting with them. Log in to your account to begin your conversation.</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(user1.email, subject1, html1);

  //   // Notify user2
  //   const subject2 = `Congratulations! You have a New Match with ${user1.firstName || user1.email}!`;
  //   const html2 = `
  //     <p>Dear ${user2.firstName || user2.email},</p>
  //     <p>Congratulations! You have a new match with <strong>${user1.firstName || user1.email}</strong>!</p>
  //     <p>You can now start chatting with them. Log in to your account to begin your conversation.</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(user2.email, subject2, html2);
  // }

  // @OnEvent('match.rejected')
  // async handleMatchRejected(payload: {
  //   senderId: string;
  //   recipientId: string;
  // }) {
  //   const [sender, recipient] = await Promise.all([
  //     this.userModel.findById(payload.senderId).exec(),
  //     this.userModel.findById(payload.recipientId).exec(),
  //   ]);

  //   if (!sender || !recipient) {
  //     this.logger.warn(
  //       `Sender or recipient not found for match rejected email: Sender ${payload.senderId}, Recipient ${payload.recipientId}`,
  //     );
  //     return;
  //   }

  //   const subject = `Update on Your Match Request to ${recipient.firstName || recipient.email}`;
  //   const html = `
  //     <p>Dear ${sender.firstName || sender.email},</p>
  //     <p>We regret to inform you that your match request to <strong>${recipient.firstName || recipient.email}</strong> was rejected.</p>
  //     <p>Don't be disheartened! There are many other profiles waiting for you. Keep searching!</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(sender.email, subject, html);
  // }

  // @OnEvent('user.suspended')
  // async handleUserSuspended(payload: { userId: string; adminId: string }) {
  //   const user = await this.userModel.findById(payload.userId).exec();
  //   const admin = await this.userModel.findById(payload.adminId).exec();

  //   if (!user) {
  //     this.logger.warn(
  //       `User not found for suspension email: ${payload.userId}`,
  //     );
  //     return;
  //   }

  //   const subject = 'Your Matrimony Account Has Been Suspended';
  //   const html = `
  //     <p>Dear ${user.firstName || user.email},</p>
  //     <p>We regret to inform you that your account on our Matrimony App has been <strong>suspended</strong>.</p>
  //     <p>This action was taken due to a violation of our terms of service. Please review our guidelines to understand the reasons for suspension.</p>
  //     <p>If you believe this is a mistake, please contact our support team immediately.</p>
  //     <p>Admin: ${admin ? admin.firstName || admin.email : 'System Admin'}</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(user.email, subject, html);
  // }

  // @OnEvent('user.activated')
  // async handleUserActivated(payload: { userId: string; adminId: string }) {
  //   const user = await this.userModel.findById(payload.userId).exec();
  //   const admin = await this.userModel.findById(payload.adminId).exec();

  //   if (!user) {
  //     this.logger.warn(
  //       `User not found for activation email: ${payload.userId}`,
  //     );
  //     return;
  //   }

  //   const subject = 'Your Matrimony Account Has Been Re-Activated';
  //   const html = `
  //     <p>Dear ${user.firstName || user.email},</p>
  //     <p>Good news! Your account on our Matrimony App has been successfully <strong>re-activated</strong> by our administration team.</p>
  //     <p>You can now log in and continue your search for a life partner.</p>
  //     <p>Admin: ${admin ? admin.firstName || admin.email : 'System Admin'}</p>
  //     <p>Best regards,<br/>The Matrimony Team</p>
  //   `;
  //   await this.sendMail(user.email, subject, html);
  // }

  @OnEvent('user.forgotPassword')
  async handleUserForgotPassword({
    email,
    resetUrl,
  }: {
    email: string;
    resetUrl: string;
  }) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      this.logger.warn(`User not found for send password rest link: ${email}`);
      return;
    }

    const subject = 'Reset Your Matrimony Account Password';

    await this.sendMail(user.email, subject, 'forgot-password', {
      name: user.firstName || user.email,
      resetUrl,
    });
  }

  @OnEvent('user.resetPassword')
  async handleUserResetPassword({ email }: { email: string }) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      this.logger.warn(`User not found for send password rest link: ${email}`);
      return;
    }

    const subject =
      'Your Matrimony Account Password Has Been Reset Successfully';

    await this.sendMail(user.email, subject, 'reset-password', {
      name: user.firstName || user.email,
    });
  }
}
