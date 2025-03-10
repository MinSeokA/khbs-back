import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { ApplyModule } from './apply/apply.module';
import { CacheModule } from '@nestjs/cache-manager'
import { createKeyv } from '@keyv/redis'
import { RedisModule } from './common/redis/redis.module';
import { IssueModule } from './issue/issue.module';
import { NoticeModule } from './notice/notice.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from './schedule/schedule.module';
import { SongsModule } from './songs/songs.module';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    process.env.EANBLE_REDIS === '1'
      ? CacheModule.register({
          useFactory: async (configService: ConfigService) => ({
            stores: [createKeyv(configService.getOrThrow('REDIS_URL'))], 
          }),
          inject: [ConfigService],
          isGlobal: true,
      })
      : CacheModule.register({
        isGlobal: true,
      }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: 'root',
      database: 'khbs',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에서 JWT 비밀 키 가져오기
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }, // JWT 만료 시간 설정
    }),
    AuthModule,
    UserModule,
    ApplyModule,
    RedisModule,
    IssueModule,
    NoticeModule,
    EventEmitterModule.forRoot(),
    ScheduleModule,
    SongsModule,
    LogsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
