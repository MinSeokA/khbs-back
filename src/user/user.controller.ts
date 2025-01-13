import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
import { RedisService } from '../common/redis/redis.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  // 유저 정보 조회
  @UseGuards(AuthGuard)
  @Get('me')
  async getUser(@Req() req: any) {
    const cacheKey = `user:${req.user.sub}`;

    let user = await this.redisService.get(cacheKey);

    if (!user) {
      user = await this.userService.findById(req.user.sub);
      this.redisService.set(cacheKey, user, 360000);
    }

    return user;
  }

  // 유저 정보 수정
  @UseGuards(AuthGuard)
  @Patch('me')
  async updateUser(
    @Req() req: any,
    @Body() updateData: UpdateUserDto,
    ) {
    return this.userService.updateUser(req.user.sub, updateData);
  }

  // 유저 탈퇴
  @UseGuards(AuthGuard)
  @Patch('me/delete')
  async deleteUser(@Req() req: any) {
    return this.userService.deleteUser(req.user.sub);
  }

  // 비밀번호 변경
  @UseGuards(AuthGuard)
  @Patch('me/change-password')
  async changePassword(
    @Req() req: any,
    @Body('password') password: string,
    ) {
    return this.userService.changePassword(req.user.sub, password);
  }
}
