import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/env.config';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cfg: ConfigService<Env, true>,
  ) {}

  @Get()
  getHello(): string {
    console.log('Current ENV:', this.cfg.get('NODE_ENV'));
    console.log('Current PORT:', this.cfg.get('PORT'));
    console.log('Current DATABASE_URL:', this.cfg.get('DATABASE_URL'));
    return this.appService.getHello();
  }
}
