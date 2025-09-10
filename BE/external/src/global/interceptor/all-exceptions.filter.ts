import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { ZodValidationException } from 'nestjs-zod';
import { AppLoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.log('Exception type:', exception.constructor.name); // Debug log

    // 1. Xử lý ZodValidationException TRƯỚC
    if (exception instanceof ZodValidationException) {
      const zodError: ZodError = (exception as any).error;
      this.logger.error(
        'ZodValidationException thrown',
        undefined,
        'HttpExceptionFilter',
        { issues: zodError.issues },
      );
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        error: zodError.issues.map((err) => ({
          code: err.code,
          path: err.path,
          message: err.message,
        })),
      });
    }

    // 2. Xử lý ZodError trực tiếp (khi parse() fail)
    if (exception instanceof ZodError) {
      this.logger.error('ZodError thrown', undefined, 'HttpExceptionFilter', {
        issues: exception.issues,
      });
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Data validation failed',
        error: exception.issues.map((err) => ({
          code: err.code,
          path: err.path,
          message: err.message,
        })),
      });
    }

    // 3. Xử lý HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resBody = exception.getResponse();
      let message: string | string[] = '';
      let error: string | null = null;

      if (typeof resBody === 'string') {
        message = resBody;
      } else if (typeof resBody === 'object' && resBody !== null) {
        message = (resBody as any).message || '';
        error = (resBody as any).error || null;
      }

      this.logger.error(
        'HttpException thrown',
        undefined,
        'HttpExceptionFilter',
        { status, message, error },
      );

      return response.status(status).json({
        statusCode: status,
        message,
        error,
      });
    }

    // 4. Xử lý Error cuối cùng
    if (exception instanceof Error) {
      this.logger.error(
        'Unknown error thrown',
        exception.stack,
        'HttpExceptionFilter',
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        },
      );
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: exception.message,
      });
    }

    // 5. Fallback
    this.logger.error(
      'Unknown Exception',
      JSON.stringify(exception),
      'HttpExceptionFilter',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error: 'Internal Server Error',
    });
  }
}
