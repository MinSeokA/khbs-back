import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(
    private readonly redisService: RedisService
  ) {}

  // 캐시 전제 조회
  @Get('all')
  async getAll() {
    return this.redisService.getAll();
  }
}
