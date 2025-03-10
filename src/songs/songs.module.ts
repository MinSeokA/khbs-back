import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';
import { RedisModule } from '../common/redis/redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LogsModule } from '../logs/logs.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
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
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}
