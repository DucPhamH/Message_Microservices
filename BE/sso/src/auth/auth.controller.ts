import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBodyDto, RegisterResponseDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginBodyDto, LoginResponseDto } from './dto/login.dto';
import { LogoutBodyDto, LogoutResponseDto } from './dto/logout.dto';
import {
  RefreshTokenBodyDto,
  RefreshTokenResponseDto,
} from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() regiterBody: RegisterBodyDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(regiterBody);
  }

  @Post('login')
  async login(@Body() loginBody: LoginBodyDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginBody);
  }

  @Post('logout')
  async logout(@Body() logoutBody: LogoutBodyDto): Promise<LogoutResponseDto> {
    return await this.authService.logout(logoutBody.refreshToken);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenBody: RefreshTokenBodyDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(refreshTokenBody.refreshToken);
  }
}
