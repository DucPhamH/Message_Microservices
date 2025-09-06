import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis, { Redis as IORedisClient, RedisOptions } from 'ioredis';
import { RedisService } from './redis.service';
import { RedisPubSubService } from './redis.pubsub.service';
import { REDIS_CLIENT } from '../constants/redis.constant';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const options: RedisOptions = {
          host: cfg.get('REDIS_HOST'),
          port: cfg.get('REDIS_PORT'),
          password: cfg.get('REDIS_PASSWORD'),
          keyPrefix: cfg.get('REDIS_KEY_PREFIX'),
          db: cfg.get('REDIS_DB', 0),
          tls: cfg.get('REDIS_TLS'),
          lazyConnect: true,
          maxRetriesPerRequest: cfg.get('REDIS_MAX_RETRIES_PER_REQ'),
          enableOfflineQueue: cfg.get('REDIS_ENABLE_OFFLINE_QUEUE'),
          connectTimeout: cfg.get('REDIS_CONNECT_TIMEOUT_MS', 10000),
          retryStrategy: (times) =>
            Math.min(times * cfg.get('REDIS_RETRY_DELAY_MS'), 2000),
        };
        const client: IORedisClient = new IORedis(options);
        return client;
      },
    },
    RedisService,
    RedisPubSubService,
  ],
  exports: [REDIS_CLIENT, RedisService, RedisPubSubService],
})
export class RedisModule {}
