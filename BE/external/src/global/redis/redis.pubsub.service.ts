import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import IORedis, { Redis as IORedisClient } from 'ioredis';

import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from '../constants/redis.constant';
import { Env } from 'src/config/env.config';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class RedisPubSubService implements OnModuleInit, OnModuleDestroy {
  private sub!: IORedisClient;
  private pub!: IORedisClient;

  constructor(
    @Inject(REDIS_CLIENT) private readonly base: IORedisClient,
    private readonly cfg: ConfigService<Env, true>,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    const common = {
      host: this.cfg.get('REDIS_HOST'),
      port: this.cfg.get('REDIS_PORT'),
      password: this.cfg.get('REDIS_PASSWORD'),
      db: this.cfg.get('REDIS_DB') || 0,
      keyPrefix: this.cfg.get('REDIS_KEY_PREFIX') || '',
      tls: this.cfg.get('REDIS_TLS') ? {} : undefined,
      lazyConnect: true,
    };

    this.sub = new IORedis(common);
    this.pub = new IORedis(common);

    await Promise.all([this.sub.connect(), this.pub.connect()]);

    this.sub.on('message', (ch, msg) =>
      this.logger.log(`Message received on ${ch}: ${msg}`),
    );
    this.sub.on('error', (e) => this.logger.error(`SUB error: ${e.message}`));
    this.pub.on('error', (e) => this.logger.error(`PUB error: ${e.message}`));
  }

  async onModuleDestroy() {
    await Promise.allSettled([this.sub?.quit(), this.pub?.quit()]);
  }

  subscribe(
    channel: string,
    handler: (message: string, channel: string) => void,
  ) {
    this.sub.on('message', (ch, msg) => {
      if (ch === channel) handler(msg, ch);
    });
    return this.sub.subscribe(channel);
  }

  publish(channel: string, message: string) {
    return this.pub.publish(channel, message);
  }
}
