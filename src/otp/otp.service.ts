import { Injectable } from '@nestjs/common';
import { EntityRepository, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OTP } from 'src/entities/otp.entity';
import { Twilio } from 'twilio';

@Injectable()
export class OTPService {
  private twilio: Twilio;

  constructor(
    @InjectRepository(OTP)
    private readonly otpRepository: EntityRepository<OTP>,
    private readonly em: EntityManager,
  ) {
    this.twilio = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async createOTP(phone: string): Promise<OTP> {
    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      // Start verification
      await this.twilio.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: formattedPhone,
          channel: 'sms',
        });

      // Create OTP record
      const otp = this.otpRepository.create({
        phone: formattedPhone,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        isUsed: false,
      });

      await this.em.persistAndFlush(otp);
      return otp;
    } catch (error) {
      console.error('Error sending verification:', error);
      throw new Error('Failed to send verification code');
    }
  }

  async verifyOTP(phone: string, code: string): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(phone);

    try {
      const verification = await this.twilio.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: formattedPhone,
          code,
        });

      if (verification.status === 'approved') {
        // Mark OTP as used
        const otp = await this.otpRepository.findOne({
          phone: formattedPhone,
          isUsed: false,
        });

        if (otp) {
          otp.isUsed = true;
          await this.em.persistAndFlush(otp);
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');

    if (!cleaned.startsWith('90')) {
      cleaned = '90' + cleaned;
    }

    return '+' + cleaned;
  }
}
