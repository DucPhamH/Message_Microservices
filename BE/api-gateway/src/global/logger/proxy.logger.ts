// src/global/logger/proxy.logger.ts
import { AppLoggerService } from './logger.service';

export function makeProxyLogger(appLogger: AppLoggerService) {
  // http-proxy-middleware v3 expects console-like methods:
  return {
    log: (msg: any) => appLogger.log(msg, 'http-proxy'),
    debug: (msg: any) => appLogger.debug?.(msg, 'http-proxy'),
    info: (msg: any) => appLogger.log(msg, 'http-proxy'),
    warn: (msg: any) => appLogger.warn(msg, 'http-proxy'),
    error: (msg: any) => appLogger.error(msg, undefined, 'http-proxy'),
  };
}
