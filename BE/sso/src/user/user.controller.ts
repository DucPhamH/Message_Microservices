import { Controller, Get, Body, Patch, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/global/decorator/public.decorator';
import { ZodSerializerDto } from 'nestjs-zod';
import { GetUserResponseDto } from './dto/get-user.dto';
import { JwtTokenService } from 'src/global/jwt/jwt-token.service';


@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private jwtService: JwtTokenService,
  ) { }

  @Public()
  @Get()
  @ZodSerializerDto(GetUserResponseDto)
  async findOne(@Headers() header: any): Promise<GetUserResponseDto> {
    const [type, token] = header?.authorization?.split(' ') ?? [];
    const payload = await this.jwtService.validateAccessToken(token);

    return await this.userService.findOne(payload.userId);
  }

  @Public()
  @Patch()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }
}
