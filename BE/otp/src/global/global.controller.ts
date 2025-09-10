import { Body, Controller, Post } from '@nestjs/common';
import { GlobalService } from './global.service';
import { CheckOtpBodyDto, CreateOtpBodyDto, OtpResDto } from './dto/otp.dto';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('otp')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Post('create')
  @ZodSerializerDto(OtpResDto)
  async createOtp(@Body() body: CreateOtpBodyDto) {
    const res = await this.globalService.createOtp(body);
    return res;
  }

  @Post('check')
  @ZodSerializerDto(OtpResDto)
  checkOtp(@Body() body: CheckOtpBodyDto) {
    return this.globalService.checkOtp(body);
  }
}
