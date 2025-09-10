import { Body, Controller, Post } from '@nestjs/common';
import { GlobalService } from './global.service';
import { CheckOtpBodyDto, CreateOtpBodyDto } from './dto/otp.dto';

@Controller('otp')
export class GlobalController {
  constructor(private readonly globalService: GlobalService) {}

  @Post('create')
  createOtp(@Body() body: CreateOtpBodyDto) {
    return this.globalService.createOtp(body);
  }

  @Post('check')
  checkOtp(@Body() body: CheckOtpBodyDto) {
    return this.globalService.checkOtp(body);
  }
}
