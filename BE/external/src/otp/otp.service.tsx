import { ConflictException, Injectable } from '@nestjs/common';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  SendOtpEmailDto,
} from './dto/otp.dto';
import ms from 'ms';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.config';
import { Resend } from 'resend';
import OTPEmail from 'src/view/otp';
import { OTP_MESSAGES } from 'src/global/constants/message.constant';
import { RedisService } from 'src/global/redis/redis.service';
import { uuidv7 } from 'uuidv7';
@Injectable()
export class OtpService {
  private resend: Resend;
  constructor(
    private readonly redisService: RedisService,
    private readonly cfg: ConfigService<Env, true>,
  ) {
    this.resend = new Resend(this.cfg.get('RESEND_API_KEY'));
  }

  async createOtp(body: CreateOtpBodyDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const id = uuidv7();
    const exp = +ms(this.cfg.get('OTP_EXPIRES_IN'));

    const [{ error }] = await Promise.all([
      this.sendOTPEmail({
        email: body.email,
        code,
      }),
      this.redisService.set(
        `otp:${id}-${body.email}-${body.type}`,
        code,
        exp / 1000, // seconds
      ),
    ]);

    if (error) {
      throw new ConflictException(error.message || OTP_MESSAGES.FAILED_TO_SEND);
    }
    return {
      ...body,
      id,
    };
  }

  async checkOtp(body: CheckOtpBodyDto) {
    const storedOtp = await this.redisService.get(
      `otp:${body.id}-${body.email}-${body.type}`,
    );

    if (!storedOtp || storedOtp !== body.code) {
      throw new ConflictException(OTP_MESSAGES.INVALID);
    }
    return body;
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
