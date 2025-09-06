import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLoggerService } from './global/logger/logger.service';
import { TransformInterceptor } from './global/interceptor/transform.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const appLogger = app.get(AppLoggerService);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useLogger(appLogger);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 4000);

  console.log('[BOOT] NODE_ENV =', config.get('NODE_ENV'));
  console.log('[BOOT] Effective PORT =', port);

  await app.listen(port);
}
void bootstrap();
