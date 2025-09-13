import { ConflictException, Injectable } from '@nestjs/common';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  SendOtpEmailDto,
} from './dto/otp.dto';
import ms from 'ms';
import { addMilliseconds } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.config';
import { Resend } from 'resend';
import OTPEmail from 'src/view/otp';
import { OtpRepository } from './otp.repo';
import { OTP_MESSAGES } from 'src/global/constants/message.constant';

@Injectable()
export class OtpService {
  private resend: Resend;
  constructor(
    private readonly otpRepo: OtpRepository,
    private readonly cfg: ConfigService<Env, true>,
  ) {
    this.resend = new Resend(this.cfg.get('RESEND_API_KEY'));
  }

  async createOtp(body: CreateOtpBodyDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { error } = await this.sendOTPEmail({
      email: body.email,
      code,
    });
    if (error) {
      throw new ConflictException(error.message || OTP_MESSAGES.FAILED_TO_SEND);
    }
    return this.otpRepo.createOtp({
      email: body.email,
      code: code,
      type: body.type,
      expiresAt: addMilliseconds(
        new Date(),
        +ms(this.cfg.get('OTP_EXPIRES_IN')),
      ),
    });
  }

  async checkOtp(body: CheckOtpBodyDto) {
    const otp = await this.otpRepo.findOtpByEmailAndCode(body);
    if (!otp) {
      throw new ConflictException(OTP_MESSAGES.INVALID);
    }
    if (otp.expiresAt < new Date()) {
      throw new ConflictException(OTP_MESSAGES.EXPIRED);
    }
    return otp;
  }

  async sendOTPEmail(payload: SendOtpEmailDto) {
    const subject = 'Mã OTP';
    return this.resend.emails.send({
      from: 'Message_Microservice <onboarding@resend.dev>',
      to: ['giahoa01giathieu@gmail.com'],
      subject,
      react: <OTPEmail otpCode={payload.code} title={subject} />,
    });
  }
}
