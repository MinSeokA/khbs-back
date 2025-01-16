import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { RedisService } from '../common/redis/redis.service';
import { Roles } from '../common/decorator/roles.decorator';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,

    private readonly redisService: RedisService
  ) {}

  // 스케줄 생성
  @Post()
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async createSchedule(
    @Body() schedule: CreateScheduleDto
  ): Promise<CreateScheduleDto> {
    const cache = await this.redisService.get('schedules');

    if (cache) {
      this.redisService.delete('schedules');
    }

    return this.scheduleService.createSchedule(schedule);
  }

  // 스케줄 전체 조회
  @Get('all')
  async getSchedules(): Promise<any> {
    const cache = await this.redisService.get('schedules');

    if (!cache) {
      const schedules = await this.scheduleService.getSchedules();
      this.redisService.set('schedules', schedules, 36000);

      return schedules;
    }

    return cache;
  }

  // 스케줄 조회
  @Get('view/:id')
  async getScheduleById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    if (!id) {
      throw new BadRequestException('ID는 비어있을 수 없습니다.');
    }

    const cache = await this.redisService.get('scheduleView:' + id);

    if (!cache) {
      const schedule = await this.scheduleService.getSchedule(id);
      this.redisService.set('scheduleView:' + id, schedule, 36000);

      return schedule;
    }

    return cache;
  }

  // 스케줄 삭제
  @Post('delete/:id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async deleteSchedule(
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const cache = await this.redisService.get('schedules');

    if (cache) {
      this.redisService.delete('schedules');
    }

    return this.scheduleService.deleteSchedule(id);
  }
  
  // 스케줄 수정
  @Post('update/:id')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() schedule: CreateScheduleDto
  ): Promise<any> {
    const cache = await this.redisService.get('schedules');

    if (cache) {
      this.redisService.delete('schedules');
    }

    return this.scheduleService.updateSchedule(id, schedule);
  }
}
