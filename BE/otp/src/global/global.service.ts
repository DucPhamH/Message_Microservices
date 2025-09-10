import { ConflictException, Injectable } from '@nestjs/common';
import { CheckOtpBodyType, CreateOtpBodyType } from './dto/otp.dto';
import ms from 'ms';
import { addMilliseconds } from 'date-fns';
import { GlobalRepository } from './global.repo';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.config';
import { OTP_MESSAGES } from './constants/message.constant';

@Injectable()
export class GlobalService {
  constructor(
    private readonly globalRepo: GlobalRepository,
    private readonly cfg: ConfigService<Env, true>,
  ) {}

  createOtp(body: CreateOtpBodyType) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
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
}
