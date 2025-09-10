import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { TransformableInfo } from 'logform';

interface TransformableInfoCustom extends TransformableInfo {
  context?: string;
  timestamp?: string;
  message: any;
  data?: any;
  level: string;
  [key: string]: any;
}

export const LoggerTransports = [
  new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(
        ({
          timestamp,
          level,
          context,
          message,
          data,
        }: TransformableInfoCustom) => {
          const msg =
            message instanceof Error
              ? message.stack || message.message
              : typeof message === 'object'
                ? JSON.stringify(message)
                : String(message ?? '');
          const dataStr = data
            ? ' | data=' +
              (typeof data === 'object' ? JSON.stringify(data) : String(data))
            : '';

          return `[${String(timestamp)}] [${String(level)}]${
            context ? ' [' + String(context) + ']' : ''
          } ${msg}${dataStr}`;
        },
      ),
    ),
  }),

  new DailyRotateFile({
    dirname: 'logs',
    filename: 'app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.json(),
    ),
  }),
];
