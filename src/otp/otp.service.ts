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

  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async createOTP(phone: string): Promise<OTP> {
    const formattedPhone = this.formatPhoneNumber(phone);

    // Generate new OTP
    const code = this.generateOTP();
    const otp = this.otpRepository.create({
      phone: formattedPhone,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      isUsed: false,
    });

    await this.em.persistAndFlush(otp);

    await this.sendSMS(formattedPhone, code);

    return otp;
  }

  async verifyOTP(phone: string, code: string): Promise<boolean> {
    const formattedPhone = this.formatPhoneNumber(phone);

    const otp = await this.otpRepository.findOne({
      phone: formattedPhone,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return false;
    }

    otp.isUsed = true;
    await this.em.persistAndFlush(otp);
    return true;
  }

  private formatPhoneNumber(phone: string): string {
    let cleaned = phone.replace(/\D/g, '');

    if (!cleaned.startsWith('90')) {
      cleaned = '90' + cleaned;
    }

    return '+' + cleaned;
  }

  private async sendSMS(phone: string, code: string) {
    try {
      await this.twilio.messages.create({
        body: `Your CafeHop verification code is: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
  }
}
