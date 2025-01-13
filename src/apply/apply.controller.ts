import { Body, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApplyService } from './apply.service';
import { applyDto } from './dto/create-apply.dto';
import { GetApplyByStudentIdAndPasswordDto } from './dto/get-apply.dto';
import { RedisService } from '../redis/redis.service';

@Controller('apply')
export class ApplyController {
  constructor(
    private readonly applyService: ApplyService,
    private readonly redisService: RedisService
  ) {}

  // 지원서 작성
  @Post()
  async writeApply(
    @Body() apply: applyDto,
  ): Promise<applyDto> {
    return this.applyService.writeApply(apply);
  }

  // 지원서 전체조회
  @Get('all')
  async getApply(): Promise<any> {
    const cache = await this.redisService.get('applys');

    if (!cache) {
      const applys = await this.applyService.getApply();
      this.redisService.set('applys', applys, 36000);

      return applys;
    }

    return cache;
  }

  // 지원서 조회
  @Get()
  async getApplyById(
    @Body() id: number,
  ): Promise<any> {
    return this.applyService.getApplyById(id);
  }

  // 지원서 삭제
  @Post('delete')
  async deleteApply(
    @Body() id: number,
  ): Promise<any> {
    return this.applyService.deleteApply(id);
  }

  // 지원서 수정
  @Post('update')
  async updateApply(
    @Body() id: number,
    @Body() apply: applyDto,
  ): Promise<any> {
    return this.applyService.updateApply(id, apply);
  }

  // 학번 및 비밀번호로 지원서 조회
  @Post('my-apply')
  async getMyApply(
    @Body() getApplyDto: GetApplyByStudentIdAndPasswordDto,
    ): Promise<any> {
    return this.applyService.getApplyByStudentIdAndPassword(getApplyDto.studentId, getApplyDto.password);
  }
}
