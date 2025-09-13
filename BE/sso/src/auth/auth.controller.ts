import { Body, Controller, Post } from '@nestjs/common';
import { RegisterBodyDto, RegisterResponseDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginBodyDto, LoginResponseDto } from './dto/login.dto';
import { LogoutBodyDto, LogoutResponseDto } from './dto/logout.dto';
import {
  RefreshTokenBodyDto,
  RefreshTokenResponseDto,
} from './dto/refresh-token.dto';
import { Public } from 'src/global/decorator/public.decorator';
import { User } from 'src/global/decorator/user.decorator';
import { ZodSerializerDto } from 'nestjs-zod';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ZodSerializerDto(RegisterResponseDto)
  async register(
    @Body() regiterBody: RegisterBodyDto,
  ): Promise<RegisterResponseDto> {
    return await this.authService.register(regiterBody);
  }

  @Public()
  @Post('login')
  @ZodSerializerDto(LoginResponseDto)
  async login(@Body() loginBody: LoginBodyDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginBody);
  }

  @Post('logout')
  @ZodSerializerDto(LogoutResponseDto)
  async logout(
    @Body() logoutBody: LogoutBodyDto,
    @User() user: User,
  ): Promise<LogoutResponseDto> {
    return await this.authService.logout(logoutBody.refreshToken, user.userId);
  }

  @Public()
  @Post('refresh-token')
  @ZodSerializerDto(RefreshTokenResponseDto)
  async refreshToken(
    @Body() refreshTokenBody: RefreshTokenBodyDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(refreshTokenBody.refreshToken);
  }
}
