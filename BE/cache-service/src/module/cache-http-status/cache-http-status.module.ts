import { Module } from '@nestjs/common';
import { CacheHttpStatusService } from './cache-http-status.service';
import { CacheHttpStatusController } from './cache-http-status.controller';
import { RedisModule } from '../../global/redis/redis.module';
import { LoggerModule } from '../../global/logger/logger.module';

@Module({
  imports: [RedisModule, LoggerModule],
  controllers: [CacheHttpStatusController],
  providers: [CacheHttpStatusService],
  exports: [CacheHttpStatusService],
})
export class CacheHttpStatusModule {}
