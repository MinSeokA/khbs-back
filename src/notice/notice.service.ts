import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly logsService: LogsService, // LogsService 주입
  ) {}

  // 공지사항 생성
  async createNotice(req: any, notice: CreateNoticeDto) {
    const newNotice = await this.noticeRepository.save(notice);

    if (!newNotice) {
      throw new InternalServerErrorException('공지사항 생성에 실패했습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '공지사항',
      action: '생성',
    });

    return newNotice;
  }

  // 공지사항 조회
  async getNotice(id: number): Promise<any> {
    const notice = await this.noticeRepository.findOne({ where: { id } });
    if (!notice) {
      throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
    }
    return notice;
  }

  // 공지사항 전체 조회
  async getNotices() {
    const notices = await this.noticeRepository.find();
    if (!notices || notices.length === 0) {
      return [];
    }
    return notices;
  }

  // 공지사항 삭제
  async deleteNotice(req: any, id: number) {
    const result = await this.noticeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '공지사항',
      action: '삭제',
    });

    return { message: '공지사항 삭제 완료' };
  }

  // 공지사항 수정
  async updateNotice(req: any, id: number, notice: UpdateNoticeDto) {
    const updateResult = await this.noticeRepository.update(id, notice);
    if (updateResult.affected === 0) {
      throw new NotFoundException('해당 공지사항을 찾을 수 없습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '공지사항',
      action: '수정',
    });

    return { message: '공지사항 수정 완료' };
  }
}