// jwt/jwt.module.ts
import { Global, Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token.service';

@Global() // để module này dùng ở bất kỳ đâu mà không cần import lại
@Module({
  imports: [
    NestJwtModule.register({
      secret: new ConfigService().get<string>('AT_SECRET_KEY'),
      signOptions: {
        expiresIn: new ConfigService().get<string>('AT_EXPIRES_IN'),
      },
    }),
  ],
  providers: [JwtTokenService],
  exports: [NestJwtModule, JwtTokenService],
})
export class JwtModule {}
