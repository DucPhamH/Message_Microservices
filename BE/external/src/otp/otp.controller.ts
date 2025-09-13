import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  OtpResponseDto,
} from '../otp/dto/otp.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('create')
  @ZodSerializerDto(OtpResponseDto)
  createOtp(@Body() body: CreateOtpBodyDto): Promise<OtpResponseDto> {
    return this.otpService.createOtp(body);
  }

  @Post('check')
  @ZodSerializerDto(OtpResponseDto)
  checkOtp(@Body() body: CheckOtpBodyDto): Promise<OtpResponseDto> {
    return this.otpService.checkOtp(body);
  }
}
