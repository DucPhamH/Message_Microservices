import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AUTH_MESSAGES } from '../constants/message.constant';
import { PayloadToken } from './dto/jwt.dto';
import { ConfigService } from '@nestjs/config';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly logger: AppLoggerService,
  ) {}

  async validateAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<PayloadToken>(token, {
        secret: this.config.get<string>('AT_SECRET_KEY'),
      });
      return payload;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        this.logger.warn('Access token expired', JwtTokenService.name);
        throw new UnauthorizedException(AUTH_MESSAGES.ACCESS_TOKEN_EXPIRED);
      }

      this.logger.error('Invalid access token', e.stack, JwtTokenService.name);
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_ACCESS_TOKEN);
    }
  }

  async validateRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<PayloadToken>(token, {
        secret: this.config.get<string>('RT_SECRET_KEY'),
      });
      return payload;
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        this.logger.warn('Refresh token expired', JwtTokenService.name);
        throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED);
      }

      this.logger.error('Invalid refresh token', e.stack, JwtTokenService.name);
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }
}
