import { ConflictException, Injectable } from '@nestjs/common';
import { CheckOtpBodyType, CreateOtpBodyType } from './dto/otp.dto';
import ms from 'ms';
import { addMilliseconds } from 'date-fns';
import { GlobalRepository } from './global.repo';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.config';
import { OTP_MESSAGES } from './constants/message.constant';
import { Resend } from 'resend';
import OTPEmail from 'src/view/otp';

@Injectable()
export class GlobalService {
  private resend: Resend;
  constructor(
    private readonly globalRepo: GlobalRepository,
    private readonly cfg: ConfigService<Env, true>,
  ) {
    this.resend = new Resend(this.cfg.get('RESEND_API_KEY'));
  }

  async createOtp(body: CreateOtpBodyType) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { error } = await this.sendOTP({
      email: body.email,
      code,
    });
    if (error) {
      throw new ConflictException(error.message || OTP_MESSAGES.FAILED_TO_SEND);
    }
    return this.globalRepo.createOtp({
      email: body.email,
      code: code,
      type: body.type,
      expiresAt: addMilliseconds(
        new Date(),
        +ms(this.cfg.get('OTP_EXPIRES_IN')),
      ),
    });
  }

  async checkOtp(body: CheckOtpBodyType) {
    const otp = await this.globalRepo.findOtpByEmailAndCode(body);
    if (!otp) {
      throw new ConflictException(OTP_MESSAGES.INVALID);
    }
    if (otp.expiresAt < new Date()) {
      throw new ConflictException(OTP_MESSAGES.EXPIRED);
    }
    return otp;
  }

  async sendOTP(payload: { email: string; code: string }) {
    const subject = 'Mã OTP';
    return this.resend.emails.send({
      from: 'Message_Microservice <onboarding@resend.dev>',
      to: ['giahoa01giathieu@gmail.com'],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />,
    });
  }
}
