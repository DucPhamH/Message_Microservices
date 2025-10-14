import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheHttpStatusService } from './module/cache-http-status/cache-http-status.service';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheHttpStatusService: CacheHttpStatusService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * API Demo: Cách service khác sử dụng HTTP status từ Redis
   * Example: GET /api/demo-status/200
   */
  @Get('demo-status/:code')
  async demoUseStatusFromRedis(@Param('code') code: string) {
    // Lấy status code từ Redis cache (cách service khác sẽ sử dụng)
    const statusCode = parseInt(code, 10);
    const statusInfo =
      await this.cacheHttpStatusService.getHttpStatusByCode(statusCode);

    if (!statusInfo) {
      // Nếu không tìm thấy, trả về 404 với thông tin từ Redis
      const notFoundInfo =
        await this.cacheHttpStatusService.getHttpStatusByCode(404);
      return {
        success: false,
        error: 'Status code not found in cache',
        status_used: notFoundInfo,
        requested_code: statusCode,
      };
    }

    // Demo: Service khác có thể sử dụng thông tin này để format response
    return {
      success: true,
      message: 'Demo: Sử dụng HTTP status từ Redis cache',
      requested_code: statusCode,
      status_from_redis: statusInfo,
      usage_example: {
        how_other_services_use:
          'Các service khác có thể gọi Redis để lấy status info',
        response_format: `HTTP ${statusInfo.code} - ${statusInfo.message}`,
        description_for_user: statusInfo.description,
      },
    };
  }
}
