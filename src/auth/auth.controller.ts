import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-userdto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // 회원가입
  @Post('register')
  async register(
    @Body() user: CreateUserDto,
  ) {
    return this.authService.createUser(user);
  }

  // 로그인
  @Post('login')
  async login(
    @Body() user: LoginUserDto,
  ) {
    return this.authService.login(user);
  }
}
