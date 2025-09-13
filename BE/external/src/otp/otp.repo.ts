import { Injectable } from '@nestjs/common';
import { OtpDto } from 'src/global/model/otp.schema';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class OtpRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createOtp(body: Pick<OtpDto, 'email' | 'code' | 'type' | 'expiresAt'>) {
    const otp = await this.prismaService.otp.create({
      data: {
        email: body.email,
        code: body.code,
        type: body.type,
        expiresAt: body.expiresAt,
      },
    });
    return otp;
  }

  async findOtpByEmailAndCode(body: Pick<OtpDto, 'email' | 'code' | 'type'>) {
    const otp = await this.prismaService.otp.findFirst({
      where: {
        email: body.email,
        code: body.code,
        type: body.type,
      },
    });
    return otp;
  }
}
