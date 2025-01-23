import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-userdto';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import e, { Request, Response } from 'express';

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
  
  // 로그아웃
  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(
    @Req() req: any,
  ) {
    // 로그아웃 처리
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          throw new Error('Session destruction failed.');
        }
      });
    }    // 서비스에서 로그아웃 처리를 수행합니다.
    return this.authService.logout();
  }
}
