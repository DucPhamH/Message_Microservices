import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  OtpResponseDto,
} from '../otp/dto/otp.dto';
import { ZodSerializerDto } from 'nestjs-zod';
import { Public } from 'src/global/decorator/public.decorator';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('create')
  @ZodSerializerDto(OtpResponseDto)
  async createOtp(@Body() body: CreateOtpBodyDto) {
    const res = await this.otpService.createOtp(body);
    return res;
  }

  @Public()
  @Post('check')
  @ZodSerializerDto(OtpResponseDto)
  checkOtp(@Body() body: CheckOtpBodyDto) {
    return this.otpService.checkOtp(body);
  }
}
