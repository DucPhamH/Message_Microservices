import { Injectable, LoggerService } from '@nestjs/common';
import { LoggerTransports } from 'src/config/logger.config';
import { createLogger } from 'winston';

@Injectable()
export class AppLoggerService implements LoggerService {
  private readonly logger = createLogger({
    transports: LoggerTransports,
  });

  private stringifyMessage(message: any): string {
    if (message instanceof Error) return message.stack || message.message;
    if (typeof message === 'object') {
      try {
        return JSON.stringify(message);
      } catch {
        return String(message);
      }
    }
    return String(message ?? '');
  }

  private stringifyData(data: any): string {
    if (typeof data === 'object') {
      try {
        return JSON.stringify(data);
      } catch {
        return String(data);
      }
    }
    return String(data ?? '');
  }

  log(message: any, context?: string, data?: any) {
    this.logger.info(this.stringifyMessage(message), {
      context,
      data: this.stringifyData(data),
    });
  }

  error(message: any, trace?: string, context?: string, data?: any) {
    this.logger.error(this.stringifyMessage(message), {
      trace,
      context,
      data: this.stringifyData(data),
    });
  }

  warn(message: any, context?: string, data?: any) {
    this.logger.warn(this.stringifyMessage(message), {
      context,
      data: this.stringifyData(data),
    });
  }

  debug?(message: any, context?: string, data?: any) {
    this.logger.debug(this.stringifyMessage(message), {
      context,
      data: this.stringifyData(data),
    });
  }

  verbose?(message: any, context?: string, data?: any) {
    this.logger.verbose(this.stringifyMessage(message), {
      context,
      data: this.stringifyData(data),
    });
  }
}
