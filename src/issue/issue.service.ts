import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from './entity/issue.entity';
import { Repository } from 'typeorm';
import { RedisService } from '../common/redis/redis.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ResponseIssueDto } from './dto/response-issue.dto';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    private readonly logsService: LogsService, // LogsService 주입
  ) {}

  // 문의 생성
  async createIssue(issue: CreateIssueDto) {
    const newIssue = await this.issueRepository.save(issue);
    return newIssue;
  }

  // 문의 조회
  async getIssue(id: number): Promise<any> {
    const issue = await this.issueRepository.findOne({ where: { id } });
    return issue;
  }

  // 문의 전체 조회
  async getIssues() {
    const issues = await this.issueRepository.find();
    return issues;
  }

  // 문의 삭제
  async deleteIssue(id: number) {
    const issue = await this.issueRepository.delete(id);
    return issue;
  }

  // 답변 작성
  async writeAnswer(req: any, id: number, answer: string): Promise<any> {
    // 입력 값 검증
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('올바른 숫자를 입력해주세요.');
    }
    if (!answer || typeof answer !== 'string') {
      throw new BadRequestException('답변을 입력해주세요.');
    }

    const issue = await this.issueRepository.findOne({ where: { id } });
    if (!issue) {
      throw new BadRequestException('해당 문의를 찾을 수 없습니다.');
    }

    try {
      await this.issueRepository.update(id, { response: answer });

      // 로그 생성
      await this.logsService.create({
        adminName: req.user.name,
        target: '문의',
        action: '답변생성',
      });

      return {
        message: '답변 작성이 완료되었습니다.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '데이터베이스 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  // 답변 수정
  async updateAnswer(req: any, id: number, answer: string): Promise<any> {
    // 입력 값 검증
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('올바른 숫자를 입력해주세요.');
    }
    if (!answer || typeof answer !== 'string') {
      throw new BadRequestException('답변을 입력해주세요.');
    }

    const issue = await this.issueRepository.findOne({ where: { id } });
    if (!issue) {
      throw new BadRequestException('해당 문의를 찾을 수 없습니다.');
    }

    try {
      await this.issueRepository.update(id, { response: answer });

      // 로그 생성
      await this.logsService.create({
        adminName: req.user.name,
        target: '문의',
        action: '답변수정',
      });

      return {
        message: '답변 수정이 완료되었습니다.',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        '데이터베이스 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  // 모든 답변 조회
  async getAnsweredIssues() {
    const issues = await this.issueRepository.find({ where: { response: '' } });
    return issues;
  }
}