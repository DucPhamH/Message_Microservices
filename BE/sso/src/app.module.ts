import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { GlobalModule } from './global/global.module';
import { LoggingInterceptor } from './global/interceptor/logging.interceptor';
import { AuthModule } from './auth/auth.module';
import { HttpExceptionFilter } from './global/interceptor/all-exceptions.filter';
import { ConfigModule } from '@nestjs/config';
import { getEnvFilePathList, validateEnv } from './config/env.config';
import { JwtAuthGuard } from './global/guard/jwt-auth.guard';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';
import { OtpModule } from './otp/otp.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePathList(),
      ignoreEnvVars: false,
      validate: validateEnv, // dùng Zod validate đã tách riêng
    }),
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR, // Cách này thay cho app.useGlobalInterceptors
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
