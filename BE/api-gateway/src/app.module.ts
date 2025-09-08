import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePathList, validateEnv } from './config/env.config';
import { HealthController } from './health/health.controller';
import { LoggingInterceptor } from './global/interceptor/logging.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePathList(),
      ignoreEnvVars: false,
      validate: validateEnv, // dùng Zod validate đã tách riêng
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR, // Cách này thay cho app.useGlobalInterceptors
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
