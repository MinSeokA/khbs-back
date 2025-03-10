import { Module } from '@nestjs/common';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entity/notice.entity';
import { RedisModule } from '../common/redis/redis.module';
import { LogsModule } from '../logs/logs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notice]),
    RedisModule,
    ConfigModule,
    LogsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }), 
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService],
})
export class NoticeModule {}
