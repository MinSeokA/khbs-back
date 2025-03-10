import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './entity/song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { LogsService } from '../logs/logs.service';

/**
 * SongsService는 노래 데이터를 관리하는 비즈니스 로직을 제공합니다.
 * CRUD(Create, Read, Update, Delete) 작업을 처리하며, 예외 처리를 통해 안정성을 보장합니다.
 */
@Injectable()
export class SongsService {
  /**
   * SongsService 생성자
   * @param songsRepository - TypeORM의 Repository를 주입받아 사용합니다.
   * @param logsService - 관리자 활동 로그를 저장하기 위한 서비스
   */
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    private readonly logsService: LogsService,
  ) {}

  /**
   * 모든 노래 목록을 조회합니다.
   * @returns Promise<Song[]> - 저장된 모든 노래 목록을 반환합니다.
   * @throws BadRequestException - 데이터베이스 오류 발생 시 예외를 던집니다.
   */
  async findAll(): Promise<Song[]> {
    try {
      return await this.songsRepository.find();
    } catch (error) {
      throw new BadRequestException('노래 목록을 불러오는 데 실패했습니다.');
    }
  }

  /**
   * 특정 ID를 가진 노래를 조회합니다.
   * @param id - 조회할 노래의 ID
   * @returns Promise<Song> - 해당 ID의 노래를 반환합니다.
   * @throws NotFoundException - 해당 ID의 노래가 존재하지 않을 경우 예외를 던집니다.
   * @throws BadRequestException - 데이터베이스 오류 발생 시 예외를 던집니다.
   */
  async findOne(id: number): Promise<Song> {
    try {
      const song = await this.songsRepository.findOneBy({ id });
      if (!song) {
        throw new NotFoundException(`ID ${id}에 해당하는 노래를 찾을 수 없습니다.`);
      }
      return song;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // 이미 정의된 NotFoundException 재전달
      }
      throw new BadRequestException('노래를 조회하는 데 실패했습니다.');
    }
  }

  /**
   * 새로운 노래를 추가합니다.
   * @param createSongDto - 노래 생성을 위한 DTO 객체
   * @returns Promise<Song> - 생성된 노래를 반환합니다.
   * @throws BadRequestException - 데이터베이스 오류 발생 시 예외를 던집니다.
   */
  async create(createSongDto: CreateSongDto): Promise<Song> {
    try {
      const song = this.songsRepository.create(createSongDto);
      return await this.songsRepository.save(song);
    } catch (error) {
      throw new BadRequestException('노래를 추가하는 데 실패했습니다.');
    }
  }

  /**
   * 특정 ID를 가진 노래를 삭제합니다.
   * @param id - 삭제할 노래의 ID
   * @param req - 요청 객체 (관리자 정보 포함)
   * @throws NotFoundException - 해당 ID의 노래가 존재하지 않을 경우 예외를 던집니다.
   * @throws BadRequestException - 데이터베이스 오류 발생 시 예외를 던집니다.
   */
  async remove(req: any, id: number): Promise<void> {
    try {
      const result = await this.songsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`ID ${id}에 해당하는 노래를 찾을 수 없습니다.`);
      }

      // 로그 생성
      await this.logsService.create({
        adminName: req.user.name,
        target: '신청곡',
        action: '삭제',
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // 이미 정의된 NotFoundException 재전달
      }
      throw new BadRequestException('노래를 삭제하는 데 실패했습니다.');
    }
  }

  /**
   * 특정 ID의 노래 상태를 업데이트합니다.
   * @param id - 업데이트할 노래의 ID
   * @param status - 새로운 상태 값
   * @param req - 요청 객체 (관리자 정보 포함)
   * @throws NotFoundException - 해당 ID의 노래가 존재하지 않을 경우 예외를 던집니다.
   * @throws BadRequestException - 상태 값이 유효하지 않을 경우 예외를 던집니다.
   */
  async updateStatus(req: any, id: number, status: number): Promise<void> {
    try {
      // 해당 ID의 노래가 존재하는지 확인
      const song = await this.songsRepository.findOne({ where: { id } });
      if (!song) {
        throw new NotFoundException(`ID ${id}에 해당하는 노래를 찾을 수 없습니다.`);
      }

      // 상태 값이 유효한지 확인
      if (!status || typeof status !== 'number') {
        throw new BadRequestException('유효한 상태 값을 제공해주세요.');
      }

      // 상태 업데이트
      await this.songsRepository.update(id, { status });

      // 상태 값에 따른 로그 메시지 생성
      let action2 = '';
      switch (status) {
        case 0:
          action2 = '대기중';
          break;
        case 1:
          action2 = '승인';
          break;
        case 2:
          action2 = '거절';
          break;
        default:
          action2 = '알 수 없음';
          break;
      }

      // 로그 생성
      await this.logsService.create({
        adminName: req.user.name,
        target: '신청곡',
        action: '상태변경 - ' + action2,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}