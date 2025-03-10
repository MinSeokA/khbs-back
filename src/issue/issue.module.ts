import { Module } from '@nestjs/common';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { RedisModule } from '../common/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entity/issue.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LogsModule } from 'src/logs/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue]),
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
  controllers: [IssueController],
  providers: [IssueService],
  exports: [IssueService],
})
export class IssueModule {}
