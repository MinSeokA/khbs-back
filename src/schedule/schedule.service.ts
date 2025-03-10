import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    private readonly logsService: LogsService,
  ) {}

  // 스케줄 생성
  async createSchedule(req: any, schedule: CreateScheduleDto): Promise<CreateScheduleDto> {
    const newSchedule = await this.scheduleRepository.save(schedule);

    if (!newSchedule) {
      throw new NotFoundException('스케줄 생성에 실패했습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '방송일정',
      action: '생성',
    });

    return { ...newSchedule, status: 200 };
  }

  // 스케줄 전체 조회
  async getSchedules(): Promise<any> {
    const schedules = await this.scheduleRepository.find();
    if (!schedules || schedules.length === 0) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }
    return schedules;
  }

  // 스케줄 조회
  async getSchedule(id: number): Promise<any> {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }
    return schedule;
  }

  // 스케줄 수정
  async updateSchedule(req: any, id: number, schedule: CreateScheduleDto): Promise<any> {
    const updateResult = await this.scheduleRepository.update(id, schedule);

    if (!updateResult || updateResult.affected === 0) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '방송일정',
      action: '수정',
    });

    return { status: 200, message: '스케줄이 수정되었습니다.' };
  }

  // 스케줄 삭제
  async deleteSchedule(req: any, id: number): Promise<any> {
    const deleteResult = await this.scheduleRepository.delete(id);

    if (!deleteResult || deleteResult.affected === 0) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '방송일정',
      action: '삭제',
    });

    return { status: 200, message: '스케줄이 삭제되었습니다.' };
  }
}