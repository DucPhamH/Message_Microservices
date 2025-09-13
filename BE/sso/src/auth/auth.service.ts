import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/global/auth/password.service';
import { RegisterBodyDto } from './dto/register.dto';
import { AUTH_MESSAGES } from 'src/global/constants/message.constant';
import { AppLoggerService } from 'src/global/logger/logger.service';
import { AuthRepository } from './auth.repo';
import { LoginBodyDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from 'src/global/jwt/jwt-token.service';
import { RedisService } from 'src/global/redis/redis.service';
import { PayloadToken } from 'src/global/jwt/dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly logger: AppLoggerService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly redisService: RedisService,
  ) {}

  private async generateToken(payload: {
    userId: string;
    username: string;
    email: string;
  }) {
    const [atSecret, rtSecret] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('AT_SECRET_KEY'),
        expiresIn: this.config.get<string>('AT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('RT_SECRET_KEY'),
        expiresIn: this.config.get<string>('RT_EXPIRES_IN'),
      }),
    ]);
    return Promise.resolve([atSecret, rtSecret]);
  }

  private getTtlFromExp(exp: number) {
    const now = Math.floor(Date.now() / 1000);
    return exp - now;
  }

  async register(data: RegisterBodyDto) {
    // Check email/username đã tồn tại chưa

    const isAvailable = await this.authRepository.checkExistingUser(
      data.email,
      data.username,
    );
    this.logger.log('Checking existing user', AuthService.name, {
      email: data.email,
      username: data.username,
      isAvailable,
    });

    if (!isAvailable) {
      throw new ConflictException(AUTH_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(data.password);
    // Tạo user mới
    const user = await this.authRepository.register({
      email: data.email,
      username: data.username,
      displayName: data.displayName,
      password: hashedPassword,
    });

    this.logger.log('User registered successfully', AuthService.name, {
      email: data.email,
      username: data.username,
    });

    return user;
  }

  async login(data: LoginBodyDto) {
    // Tìm user theo email hoặc username
    const user = await this.authRepository.findByEmailOrUsername(
      data.email,
      data.username,
    );
    if (!user) {
      this.logger.warn('User not found', AuthService.name, {
        email: data.email,
        username: data.username,
      });
      throw new ConflictException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    // Kiểm tra mật khẩu
    const isPasswordValid = await this.passwordService.compare(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      this.logger.warn('Invalid password', AuthService.name, {
        email: data.email,
        username: data.username,
      });
      throw new ConflictException(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }
    // Tạo access token và refresh token
    const [accessToken, refreshToken] = await this.generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
    });
    // decode refresh token để lấy payload
    const decoded: PayloadToken =
      await this.jwtTokenService.validateRefreshToken(refreshToken);

    // Lưu refresh token vào redis với thời gian hết hạn là thời gian của fresh token
    const ttl = this.getTtlFromExp(decoded.exp); // seconds

    await this.redisService.set(
      `refresh_token:${user.id}-&${refreshToken}`,
      JSON.stringify({
        token: refreshToken,
        userId: user.id,
        exp: decoded.exp,
        iat: decoded.iat,
        ttl: ttl,
      }),
      ttl, // seconds
    );
    // Trả về token cho client

    const response = {
      user: {
        userId: user.id,
        email: user.email,
        username: user.username,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
    this.logger.log('User logged in successfully', AuthService.name, {
      email: user.email,
      username: user.username,
    });
    return response;
  }

  async logout(refreshToken: string, userId: string) {
    // Validate refresh token
    const decoded =
      await this.jwtTokenService.validateRefreshToken(refreshToken);
    // Xóa refresh token khỏi redis
    const result = await this.redisService.del(
      `refresh_token:${decoded.userId}-&${refreshToken}`,
    );

    // Chỉ cho phép logout nếu userId truyền vào trùng với userId trong token
    if (decoded.userId !== userId) {
      this.logger.warn('User ID mismatch on logout', AuthService.name, {
        tokenUserId: decoded.userId,
        requestUserId: userId,
      });
      return {
        message: AUTH_MESSAGES.LOGOUT_FAIL,
      };
    }

    if (result === 1) {
      this.logger.log('User logged out successfully', AuthService.name, {
        userId: decoded.userId,
      });
      return {
        message: AUTH_MESSAGES.LOGOUT_SUCCESS,
      };
    } else {
      this.logger.warn('Refresh token not found in Redis', AuthService.name, {
        userId: decoded.userId,
      });
      return {
        message: AUTH_MESSAGES.LOGOUT_FAIL,
      };
    }
  }

  async refreshToken(oldRefreshToken: string) {
    // 1. Validate refresh token cũ
    const decoded =
      await this.jwtTokenService.validateRefreshToken(oldRefreshToken);

    // 2. Check trong Redis
    const storedToken = await this.redisService.get(
      `refresh_token:${decoded.userId}-&${oldRefreshToken}`,
    );
    if (!storedToken) {
      this.logger.warn('Refresh token not found in Redis', AuthService.name, {
        userId: decoded.userId,
      });
      throw new ConflictException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    // 3. Tạo access token mới + refresh token mới (cùng TTL với token cũ)
    const [accessToken, refreshToken] = await this.generateToken({
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
    });

    // 4. TTL = thời gian còn lại của token cũ
    const ttl = this.getTtlFromExp(decoded.exp); // seconds

    // 5. Lưu refresh token mới, xoá token cũ
    await Promise.all([
      this.redisService.set(
        `refresh_token:${decoded.userId}-&${refreshToken}`,
        JSON.stringify({
          token: refreshToken,
          userId: decoded.userId,
          exp: decoded.exp,
          iat: decoded.iat,
          ttl: ttl,
        }),
        ttl, // seconds
      ),
      this.redisService.del(
        `refresh_token:${decoded.userId}-&${oldRefreshToken}`,
      ),
    ]);

    this.logger.log('Refresh token successfully', AuthService.name, {
      userId: decoded.userId,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
