import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { RegisterBodyDto } from './dto/register.dto';
import { PrismaUniqueException } from 'src/global/exception/exception.custorm';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkExistingUser(email: string, username: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (user) {
      return false;
    }
    return true;
  }

  async findByEmailOrUsername(email?: string, username?: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    return user;
  }

  async register(data: RegisterBodyDto) {
    // Tạo user mới
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          displayName: data.displayName,
          password: data.password,
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new PrismaUniqueException(
          error.meta?.modelName as string,
          Array.isArray(error.meta?.target)
            ? (error.meta?.target as string[])
            : [],
        );
      }
      throw error;
    }
  }
}
