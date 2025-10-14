import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../../global/redis/redis.service';
import { AppLoggerService } from '../../global/logger/logger.service';
import {
  HTTP_STATUS_CODES,
  HTTP_STATUS_CACHE_KEYS,
  HTTP_STATUS_CACHE_TTL,
  HttpStatusInfo,
} from '../../global/constants/http-status.constant';

@Injectable()
export class CacheHttpStatusService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private readonly logger: AppLoggerService,
  ) {}

  async onModuleInit() {
    await this.loadHttpStatusToRedis();
  }

  /**
   * Load tất cả HTTP status codes vào Redis khi server khởi động
   */
  private async loadHttpStatusToRedis(): Promise<void> {
    try {
      this.logger.log(
        'Starting to load HTTP status codes to Redis...',
        CacheHttpStatusService.name,
      );

      // Load tất cả status codes dưới dạng JSON
      const allStatusCodes = JSON.stringify(HTTP_STATUS_CODES);
      await this.redisService.set(
        HTTP_STATUS_CACHE_KEYS.ALL_STATUS_CODES,
        allStatusCodes,
        HTTP_STATUS_CACHE_TTL,
      );

      // Load từng status code theo mã số
      const codePromises = Object.values(HTTP_STATUS_CODES).map(
        async (status) => {
          const key = HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_CODE(status.code);
          await this.redisService.set(
            key,
            JSON.stringify(status),
            HTTP_STATUS_CACHE_TTL,
          );
        },
      );

      // Load từng status code theo tên
      const namePromises = Object.entries(HTTP_STATUS_CODES).map(
        async ([name, status]) => {
          const key = HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_NAME(name);
          await this.redisService.set(
            key,
            JSON.stringify(status),
            HTTP_STATUS_CACHE_TTL,
          );
        },
      );

      await Promise.all([...codePromises, ...namePromises]);

      const totalCodes = Object.keys(HTTP_STATUS_CODES).length;
      this.logger.log(
        `Successfully loaded ${totalCodes} HTTP status codes to Redis`,
        CacheHttpStatusService.name,
      );
    } catch (error) {
      this.logger.error(
        'Failed to load HTTP status codes to Redis',
        error instanceof Error ? error.stack : String(error),
        CacheHttpStatusService.name,
      );
      throw error;
    }
  }

  /**
   * Lấy tất cả HTTP status codes từ Redis
   */
  async getAllHttpStatusCodes(): Promise<Record<
    string,
    HttpStatusInfo
  > | null> {
    try {
      const data = await this.redisService.get(
        HTTP_STATUS_CACHE_KEYS.ALL_STATUS_CODES,
      );
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(
        'Failed to get all HTTP status codes from Redis',
        error instanceof Error ? error.stack : String(error),
        CacheHttpStatusService.name,
      );
      return null;
    }
  }

  /**
   * Lấy HTTP status code theo mã số
   */
  async getHttpStatusByCode(code: number): Promise<HttpStatusInfo | null> {
    try {
      const key = HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_CODE(code);
      console.log('Fetching from Redis with key:', key);
      const data = await this.redisService.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(
        `Failed to get HTTP status code ${code} from Redis`,
        error instanceof Error ? error.stack : String(error),
        CacheHttpStatusService.name,
      );
      return null;
    }
  }

  /**
   * Lấy HTTP status code theo tên
   */
  async getHttpStatusByName(name: string): Promise<HttpStatusInfo | null> {
    try {
      const key = HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_NAME(name);
      const data = await this.redisService.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(
        `Failed to get HTTP status ${name} from Redis`,
        error instanceof Error ? error.stack : String(error),
        CacheHttpStatusService.name,
      );
      return null;
    }
  }

  /**
   * Refresh lại cache HTTP status codes
   */
  async refreshHttpStatusCache(): Promise<void> {
    this.logger.log(
      'Refreshing HTTP status codes cache...',
      CacheHttpStatusService.name,
    );
    await this.loadHttpStatusToRedis();
  }

  /**
   * Xóa cache HTTP status codes
   */
  async clearHttpStatusCache(): Promise<void> {
    try {
      this.logger.log(
        'Clearing HTTP status codes cache...',
        CacheHttpStatusService.name,
      );

      // Xóa cache tất cả status codes
      await this.redisService.del(HTTP_STATUS_CACHE_KEYS.ALL_STATUS_CODES);

      // Xóa cache theo mã số
      const codeKeys = Object.values(HTTP_STATUS_CODES).map((status) =>
        HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_CODE(status.code),
      );

      // Xóa cache theo tên
      const nameKeys = Object.keys(HTTP_STATUS_CODES).map((name) =>
        HTTP_STATUS_CACHE_KEYS.STATUS_CODE_BY_NAME(name),
      );

      const allKeys = [...codeKeys, ...nameKeys];
      if (allKeys.length > 0) {
        await this.redisService.del(...allKeys);
      }

      this.logger.log(
        'HTTP status codes cache cleared successfully',
        CacheHttpStatusService.name,
      );
    } catch (error) {
      this.logger.error(
        'Failed to clear HTTP status codes cache',
        error instanceof Error ? error.stack : String(error),
        CacheHttpStatusService.name,
      );
      throw error;
    }
  }
}
