import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { Repository } from 'typeorm';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>
  ) {}

  // 스케줄 생성
  async createSchedule(schedule: CreateScheduleDto): Promise<CreateScheduleDto> {
    const newSchedule = await this.scheduleRepository.save(schedule);
    
    if (!newSchedule) {
      return null;
    }

    return { ...newSchedule, status: 200 };
  }

  // 스케줄 전체 조회
  async getSchedules(): Promise<any> {
    const schedules = await this.scheduleRepository.find();

    if (!schedules) {
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
  async updateSchedule(id: number, schedule: CreateScheduleDto): Promise<any> {
    const updateSchedule = await this.scheduleRepository.update(id, schedule);

    if (!updateSchedule) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }

    return { ...updateSchedule, status: 200, message: '스케줄이 수정되었습니다.' };
  }

  // 스케줄 삭제
  async deleteSchedule(id: number): Promise<any> {
    const deleteSchedule = await this.scheduleRepository.delete(id);

    if (!deleteSchedule) {
      throw new NotFoundException('스케줄이 존재하지 않습니다.');
    }

    return { ...deleteSchedule, status: 200, message: '스케줄이 삭제되었습니다.' };
  }
}
