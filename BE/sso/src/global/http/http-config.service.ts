import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Env } from 'src/config/env.config';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  constructor(private readonly cfg: ConfigService<Env, true>) {}

  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: +ms(this.cfg.get('HTTP_TIMEOUT')),
      maxRedirects: this.cfg.get('HTTP_MAX_REDIRECTS'),
    };
  }
}
