import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './global/redis/redis.module';
import { LoggerModule } from './global/logger/logger.module';
import { CacheHttpStatusModule } from './module/cache-http-status/cache-http-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    LoggerModule,
    CacheHttpStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
