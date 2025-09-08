import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtTokenService } from '../jwt/jwt-token.service';
import { AUTH_MESSAGES } from '../constants/message.constant';
import { AppLoggerService } from '../logger/logger.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtTokenService,
    private reflector: Reflector,
    private readonly logger: AppLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(AUTH_MESSAGES.NO_TOKEN);
    }

    const payload = await this.jwtService.validateAccessToken(token);

    if (!payload) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_ACCESS_TOKEN);
    }

    this.logger.log(`User ${payload.username} is authenticated`);

    request['user'] = {
      userId: payload.userId,
      username: payload.username,
      roles: payload.email,
    };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
