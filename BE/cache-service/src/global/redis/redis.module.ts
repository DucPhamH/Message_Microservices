import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis as IORedisClient, RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';
// import { RedisPubSubService } from './redis.pubsub.service';
import { REDIS_CLIENT } from '../constants/redis.constant';
import { LoggerModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const options: RedisOptions = {
          host: cfg.get<string>('REDIS_HOST'),
          port: Number(cfg.get('REDIS_PORT', 6379)),
          password: cfg.get<string>('REDIS_PASSWORD'),
          keyPrefix: cfg.get<string>('REDIS_KEY_PREFIX'),
          db: Number(cfg.get('REDIS_DB', 0)),
          tls: cfg.get('REDIS_TLS') === 'true' ? {} : undefined,

          lazyConnect: true,
          maxRetriesPerRequest: Number(
            cfg.get('REDIS_MAX_RETRIES_PER_REQ', 20),
          ),
          enableOfflineQueue: cfg.get('REDIS_ENABLE_OFFLINE_QUEUE') === 'true',
          connectTimeout: Number(cfg.get('REDIS_CONNECT_TIMEOUT_MS', 10000)),
          retryStrategy: (times) =>
            Math.min(times * Number(cfg.get('REDIS_RETRY_DELAY_MS', 50)), 2000),
        };

        const client: IORedisClient = new IORedis(options);
        return client;
      },
    },
    RedisService,
    // RedisPubSubService,
  ],
  exports: [
    REDIS_CLIENT,
    RedisService,
    // RedisPubSubService
  ],
})
export class RedisModule {}
