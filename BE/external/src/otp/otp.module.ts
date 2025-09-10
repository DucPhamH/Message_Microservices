import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { OtpRepository } from './otp.repo';

@Module({
  controllers: [OtpController],
  providers: [OtpService, OtpRepository],
})
export class OtpModule {}
