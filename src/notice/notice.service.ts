import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
  ) {}

  // 공지사항 생성
  async createNotice(notice: CreateNoticeDto) {
    const newNotice = await this.noticeRepository.save(notice);
    
    if (!newNotice) {
      throw new InternalServerErrorException('공지사항 생성에 실패했습니다.');
    }

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
  async deleteNotice(id: number) {
    const notice = await this.noticeRepository.delete(id);

    if (!notice) {
      throw new InternalServerErrorException('공지사항 삭제에 실패했습니다.');
    }

    return { message: '공지사항 삭제 완료' };
  }

  // 공지사항 수정
  async updateNotice(id: number, notice: UpdateNoticeDto) {
    const updateNotice = await this.noticeRepository.update(id, notice);

    if (!updateNotice) {
      throw new InternalServerErrorException('공지사항 수정에 실패했습니다.');
    }

    return updateNotice;
  }

}
