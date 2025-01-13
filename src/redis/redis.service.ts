import { createKeyv } from '@keyv/redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private readonly redisClient;

  constructor(private readonly configService: ConfigService) {
    this.redisClient = createKeyv(this.configService.getOrThrow('REDIS_URL'));
  }

  // 캐시 조회
  get(key: string) {
    return this.redisClient.get(key);
  }

  // 캐시 저장
  set(key: string, value: any, ttl?: number) {
    return this.redisClient.set(key, value, ttl);
  }

  // 캐시 삭제
  async delete(key: string) {
    return await this.redisClient.delete(key);
  }

  // 모든 캐시 조회
  async getAll() {
    // 모든 키 가져오기
    const keys = await this.redisClient.store.adapter.keys('*');
    const values = await Promise.all(keys.map(key => this.redisClient.get(key)));

    // 키와 값을 함께 반환
    return keys.map((key, index) => ({ key, value: values[index] }));
  }
}
