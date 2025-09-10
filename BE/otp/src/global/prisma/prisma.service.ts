import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppLoggerService } from '../logger/logger.service';
const TAG_NAME = 'PrismaService';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly logger: AppLoggerService) {
    super({
      log: ['info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    this.logger.log('Connecting to the database...', TAG_NAME);
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.log('Disconnecting from the database...', TAG_NAME);
    await this.$disconnect();
  }
}
