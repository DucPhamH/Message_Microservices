import {
  Inject,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import type { Redis as IORedisClient } from 'ioredis';
import { AppLoggerService } from '../logger/logger.service';
import { REDIS_CLIENT } from '../constants/redis.constant';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: IORedisClient,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    if (this.client.status !== 'ready' && this.client.status !== 'connecting') {
      await this.client.connect();
      this.logger.log(
        `Redis connected (status: ${this.client.status})`,
        RedisService.name,
      );
    }
    this.client.on('error', (err) =>
      this.logger.error(
        `Redis error: ${err?.message}`,
        undefined,
        RedisService.name,
      ),
    );
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
    } catch {
      this.client.disconnect();
    }
  }

  // --- KV ---
  get(key: string) {
    return this.client.get(key);
  }
  set(key: string, value: string, ttlSec?: number) {
    return ttlSec
      ? this.client.set(key, value, 'EX', ttlSec)
      : this.client.set(key, value);
  }
  del(...keys: string[]) {
    return this.client.del(...keys);
  }
  exists(...keys: string[]) {
    return this.client.exists(...keys);
  }
  mget(...keys: string[]) {
    return this.client.mget(...keys);
  }
  mset(kv: Record<string, string>) {
    const flat: string[] = [];
    for (const [k, v] of Object.entries(kv)) flat.push(k, v);
    return this.client.mset(flat);
  }
  expire(key: string, ttlSec: number) {
    return this.client.expire(key, ttlSec);
  }
  incrby(key: string, inc = 1) {
    return this.client.incrby(key, inc);
  }
  ttl(key: string) {
    return this.client.ttl(key);
  }

  // --- Hash ---
  hset(key: string, map: Record<string, string | number>) {
    return this.client.hset(key, map as any);
  }
  hgetall(key: string) {
    return this.client.hgetall(key);
  }
  hdel(key: string, ...fields: string[]) {
    return this.client.hdel(key, ...fields);
  }

  // --- Set ---
  sadd(key: string, ...members: string[]) {
    return this.client.sadd(key, ...members);
  }
  smembers(key: string) {
    return this.client.smembers(key);
  }
  srem(key: string, ...members: string[]) {
    return this.client.srem(key, ...members);
  }

  // --- List / Queue ---
  lpush(key: string, ...values: string[]) {
    return this.client.lpush(key, ...values);
  }
  rpop(key: string) {
    return this.client.rpop(key);
  }
  brpop(key: string, timeoutSec = 0) {
    return this.client.brpop(key, timeoutSec);
  }

  // --- Keys / Scan ---
  keys(pattern: string) {
    return this.client.keys(pattern);
  }
  async *scanIterator(pattern = '*', count = 100) {
    for await (const key of this.client.scanStream({ match: pattern, count })) {
      yield key as unknown as string;
    }
  }

  // --- Raw client (nếu cần API ioredis gốc) ---
  raw() {
    return this.client;
  }
}
