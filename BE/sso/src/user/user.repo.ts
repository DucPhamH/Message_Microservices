import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/global/prisma/prisma.service";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findByUserId(id?: string) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });

    return user? user : "";
  }
}

