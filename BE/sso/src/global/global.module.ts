// shared/shared.module.ts
import { Module, Global } from '@nestjs/common';

import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { PasswordService } from './auth/password.service';
import { LoggerModule } from './logger/logger.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { RedisModule } from './redis/redis.module';
import { JwtModule } from './jwt/jwt.module';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { HttpConfigService } from './http/http-config.service';
import { HttpModule } from '@nestjs/axios';

@Global() // Đánh dấu global để không cần import mỗi module
@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    RedisModule,
    JwtModule,
    HttpModule.registerAsync({
      useExisting: HttpConfigService,
    }),
  ],
  providers: [
    LoggingInterceptor,
    PasswordService,
    TransformInterceptor,
    JwtAuthGuard,
    HttpConfigService,
  ],
  exports: [
    LoggingInterceptor,
    PrismaModule,
    PasswordService,
    LoggerModule,
    TransformInterceptor,
    RedisModule,
    JwtModule,
    JwtAuthGuard,
    HttpConfigService,
    HttpModule,
  ],
})
export class GlobalModule {}
