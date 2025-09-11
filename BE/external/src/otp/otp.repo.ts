import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { OtpDto } from './model/otp.schema';

@Injectable()
export class OtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  createOtp(body: Pick<OtpDto, 'email' | 'code' | 'type' | 'expiresAt'>) {
    return this.prismaService.otp.create({
      data: body,
    });
  }

  findOtpByEmailAndCode(body: Pick<OtpDto, 'email' | 'code' | 'type'>) {
    return this.prismaService.otp.findFirst({
      where: body,
    });
  }
}
