import {
  Body,
  Controller,
  Post,
  Get,
  ParseIntPipe,
  Param,
  BadRequestException,
  Delete,
  Req,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { RedisService } from '../common/redis/redis.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly redisService: RedisService,
  ) {}

  // 공지사항 생성
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async createNotice(
    @Req() req: any,
    @Body() notice: CreateNoticeDto,
  ): Promise<CreateNoticeDto> {
    const cache = await this.redisService.get('notices');

    if (cache) {
      this.redisService.delete('notices');
    }

    return this.noticeService.createNotice(req, notice);
  }

  // 공지사항 전체 조회
  @Get('all')
  async getNotices(): Promise<any> {
    const cache = await this.redisService.get('notices');

    if (!cache) {
      const notices = await this.noticeService.getNotices();
      this.redisService.set('notices', notices, 3600);

      return notices;
    }

    return cache;
  }

  // 공지사항 조회
  @Get('view/:id')
  async getNoticeById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    if (!id) {
      throw new BadRequestException('ID는 비어있을 수 없습니다.');
    }

    const cache = await this.redisService.get('noticeView:' + id);

    if (!cache) {
      const notice = await this.noticeService.getNotice(id);
      this.redisService.set('noticeView:' + id, notice, 3600);

      return notice;
    }

    return cache;
  }

  // 공지사항 삭제
  @Delete(':id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteNotice(
    @Req() req: any,
    @Param() id: number
  ): Promise<any> {
    const cache = await this.redisService.get('notices');

    if (cache) {
      this.redisService.delete('notices');
    }

    return this.noticeService.deleteNotice(req, id);

  }

  // 공지사항 수정
  @Post('update/:id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async updateNotice(
    @Req() req: any,
    @Param() id: number,
    @Body() notice: UpdateNoticeDto,
  ): Promise<any> {
    return this.noticeService.updateNotice(req, id, notice);
  }
}
