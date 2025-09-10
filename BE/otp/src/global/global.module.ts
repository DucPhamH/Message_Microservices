// shared/shared.module.ts
import { Module, Global } from '@nestjs/common';

import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './logger/logger.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { RedisModule } from './redis/redis.module';
import { GlobalService } from './global.service';
import { GlobalController } from './global.controller';
import { GlobalRepository } from './global.repo';

@Global() // Đánh dấu global để không cần import mỗi module
@Module({
  imports: [PrismaModule, LoggerModule, RedisModule],
  providers: [
    LoggingInterceptor,
    TransformInterceptor,
    GlobalService,
    GlobalRepository,
  ],
  controllers: [GlobalController],
  exports: [
    LoggingInterceptor,
    PrismaModule,
    LoggerModule,
    TransformInterceptor,
    RedisModule,
  ],
})
export class GlobalModule {}
