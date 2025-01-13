import {
  Body,
  Controller,
  Post,
  Get,
  ParseIntPipe,
  Param,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { RedisService } from '../common/redis/redis.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Roles } from '../common/decorator/roles.decorator';

@Controller('notice')
export class NoticeController {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly redisService: RedisService,
  ) {}

  // 공지사항 생성
  @Post()
  @Roles('admin')
  async createNotice(
    @Body() notice: CreateNoticeDto,
  ): Promise<CreateNoticeDto> {
    const cache = await this.redisService.get('notices');

    if (cache) {
      this.redisService.delete('notices');
    }

    return this.noticeService.createNotice(notice);
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
  @Roles('admin')
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
  async deleteNotice(
    @Param() id: number
  ): Promise<any> {
    const cache = await this.redisService.get('notices');

    if (cache) {
      this.redisService.delete('notices');
    }

    return this.noticeService.deleteNotice(id);

  }

  // 공지사항 수정
  @Post('update')
  @Roles('admin')
  async updateNotice(
    @Body() id: number,
    @Body() notice: UpdateNoticeDto,
  ): Promise<any> {
    return this.noticeService.updateNotice(id, notice);
  }
}
