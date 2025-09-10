import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  OtpResDto,
} from '../otp/dto/otp.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('create')
  @ZodSerializerDto(OtpResDto)
  createOtp(@Body() body: CreateOtpBodyDto): Promise<OtpResDto> {
    return this.otpService.createOtp(body);
  }

  @Post('check')
  @ZodSerializerDto(OtpResDto)
  checkOtp(@Body() body: CheckOtpBodyDto): Promise<OtpResDto> {
    return this.otpService.checkOtp(body);
  }
}
