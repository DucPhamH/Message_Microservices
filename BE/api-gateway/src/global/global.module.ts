// shared/shared.module.ts
import { Module, Global } from '@nestjs/common';

import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { LoggerModule } from './logger/logger.module';

@Global() // Đánh dấu global để không cần import mỗi module
@Module({
  imports: [LoggerModule],
  providers: [LoggingInterceptor],
  exports: [LoggingInterceptor, LoggerModule],
})
export class GlobalModule {}
