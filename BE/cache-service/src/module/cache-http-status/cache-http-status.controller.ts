import { Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { CacheHttpStatusService } from './cache-http-status.service';
import { HttpStatusInfo } from '../../global/constants/http-status.constant';

@Controller('cache/http-status')
export class CacheHttpStatusController {
  constructor(
    private readonly cacheHttpStatusService: CacheHttpStatusService,
  ) {}

  /**
   * Lấy tất cả HTTP status codes từ cache
   */
  @Get('all')
  async getAllHttpStatusCodes(): Promise<{
    success: boolean;
    data: Record<string, HttpStatusInfo> | null;
  }> {
    const data = await this.cacheHttpStatusService.getAllHttpStatusCodes();
    return {
      success: true,
      data,
    };
  }

  /**
   * Lấy HTTP status code theo mã số
   */
  @Get('code/:code')
  async getHttpStatusByCode(@Param('code') code: string): Promise<{
    success: boolean;
    data: HttpStatusInfo | null;
  }> {
    const statusCode = parseInt(code, 10);
    if (isNaN(statusCode)) {
      return {
        success: false,
        data: null,
      };
    }

    const data =
      await this.cacheHttpStatusService.getHttpStatusByCode(statusCode);
    return {
      success: true,
      data,
    };
  }

  /**
   * Lấy HTTP status code theo tên
   */
  @Get('name/:name')
  async getHttpStatusByName(@Param('name') name: string): Promise<{
    success: boolean;
    data: HttpStatusInfo | null;
  }> {
    const data = await this.cacheHttpStatusService.getHttpStatusByName(
      name.toUpperCase(),
    );
    return {
      success: true,
      data,
    };
  }

  /**
   * Refresh cache HTTP status codes
   */
  @Post('refresh')
  async refreshCache(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.cacheHttpStatusService.refreshHttpStatusCache();
      return {
        success: true,
        message: 'HTTP status codes cache refreshed successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to refresh HTTP status codes cache',
      };
    }
  }

  /**
   * Xóa cache HTTP status codes
   */
  @Delete('clear')
  async clearCache(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await this.cacheHttpStatusService.clearHttpStatusCache();
      return {
        success: true,
        message: 'HTTP status codes cache cleared successfully',
      };
    } catch {
      return {
        success: false,
        message: 'Failed to clear HTTP status codes cache',
      };
    }
  }
}
