import { Injectable } from '@nestjs/common';
import {
  CheckOtpBodyDto,
  CreateOtpBodyDto,
  OtpResponseDto,
} from './dto/otp.dto';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env.config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { AppLoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly cfg: ConfigService<Env, true>,
    private readonly httpService: HttpService,
    private readonly logger: AppLoggerService,
  ) {}

  async createOtp(body: CreateOtpBodyDto): Promise<OtpResponseDto> {
    const url = this.cfg.get('EXTERNAL_SERVICE_URL') + '/otp/create';
    const { data: response } = await this.httpService.axiosRef
      .post<{
        data: OtpResponseDto;
      }>(url, body)
      .catch((error: AxiosError) => {
        throw error;
      });
    return response.data;
  }

  async checkOtp(body: CheckOtpBodyDto): Promise<OtpResponseDto> {
    const url = this.cfg.get('EXTERNAL_SERVICE_URL') + '/otp/check';
    const { data: response } = await this.httpService.axiosRef
      .post<{
        data: OtpResponseDto;
      }>(url, body)
      .catch((error: AxiosError) => {
        throw error;
      });
    return response.data;
  }
}
