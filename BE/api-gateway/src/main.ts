import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from './global/logger/logger.service';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { makeProxyLogger } from './global/logger/proxy.logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  // logger
  const appLogger = app.get(AppLoggerService);
  app.useLogger(appLogger);

  //trust proxy
  app.set('trust proxy', 1);

  // CORS
  const rawOrigins = config.get<string>('CORS_ORIGINS', '*');
  const isWildcard = rawOrigins === '*';
  app.enableCors({
    origin: isWildcard ? true : rawOrigins.split(','),
    credentials: !isWildcard, // chỉ bật khi KHÔNG dùng '*'
  });

  // Middleware để thêm requestId vào header response và object req
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Thêm một ID duy nhất cho mỗi request để dễ dàng trace log hơn
    (req as any).requestId = randomUUID();
    res.setHeader('X-Request-Id', (req as any).requestId);
    next();
  });

  // Helmet
  app.use(helmet());

  // Rate limit
  app.use(
    rateLimit({
      windowMs: config.get<number>('RATE_LIMIT_WINDOW_MS', 1 * 60 * 1000), // 1 minute
      max: config.get<number>('RATE_LIMIT_MAX', 100), // limit each IP to 100 requests per windowMs
    }),
  );

  // Proxy to upstream auth service

  app.use(
    '/api/auth',
    createProxyMiddleware({
      target: config.get<string>('UPSTREAM_AUTH'),
      changeOrigin: true,
      pathRewrite: {
        '^/api/auth': '',
      },
      proxyTimeout: Number(config.get('PROXY_TIMEOUT_MS') ?? 15_000),
      timeout: Number(config.get('CLIENT_TIMEOUT_MS') ?? 16_000),
      logger: makeProxyLogger(appLogger),
      on: {
        proxyReq: (proxyReq, req) => {
          const cid = (req as any).requestId;
          if (cid) {
            proxyReq.setHeader('X-Request-Id', cid);
          }
          fixRequestBody(proxyReq, req);

          appLogger.log(
            `[AUTH→] ${req.method} ${req.url} cid=${cid}`,
            'proxy/auth',
          );
        },
        proxyRes: (proxyRes, req) => {
          const rid =
            (req as any).requestId ??
            (req.headers['x-request-id'] as string | undefined);
          appLogger.log(
            `[AUTH←] ${req.method} ${req.url} status=${proxyRes.statusCode} requestId=${rid}`,
            'proxy/auth',
          );
        },
        error: (err, req) => {
          const rid =
            (req as any).requestId ??
            (req.headers['x-request-id'] as string | undefined);
          appLogger.error(
            `[AUTH×] ${req.method} ${req.url} requestId=${rid} -> ${err.message}`,
            err.stack,
            'proxy/auth',
          );
        },
      },
    }),
  );

  const port = config.get<number>('PORT', 4000);

  console.log('[BOOT] NODE_ENV =', config.get('NODE_ENV'));
  console.log('[BOOT] Effective PORT =', port);

  await app.listen(port);
}
void bootstrap();
