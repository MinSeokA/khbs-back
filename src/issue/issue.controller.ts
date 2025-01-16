import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { IssueService } from './issue.service';
import { RedisService } from 'src/common/redis/redis.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ResponseIssueDto } from './dto/response-issue.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('issue')
export class IssueController {
  constructor(
    private readonly issueService: IssueService,

    private readonly redisService: RedisService
  ) {}

  // 문의 생성
  @Post()
  async createIssue(
    @Body() issue: CreateIssueDto
  ): Promise<CreateIssueDto> {
    const cache = await this.redisService.get('issues');

    if (cache) {
      this.redisService.delete('issues');
    }

    return this.issueService.createIssue(issue);
  }

  // 문의 전체 조회
  @Get('all')
  async getIssues(): Promise<any> {
    const cache = await this.redisService.get('issues');

    if (!cache) {
      const issues = await this.issueService.getIssues();
      this.redisService.set('issues', issues, 36000);

      return issues;
    }

    return cache;
  }

  // 문의 조회
  @Get('view/:id')
  async getIssueById(
    @Param('id', ParseIntPipe) id: number
    ): Promise<any> {
    if (!id) {
      throw new BadRequestException('ID는 비어있을 수 없습니다.');
    }

    const cache = await this.redisService.get('issueView:' + id);

    if (!cache) {
      const issue = await this.issueService.getIssue(id);
      this.redisService.set('issueView:' + id, issue, 36000);

      return issue;
    }

    return cache;
  }

  // 문의 삭제
  @Delete('delete/:id')
  async deleteIssue(
    @Param() id: number
  ): Promise<any> {
    const cache = await this.redisService.get('issues');

    if (cache) {
      this.redisService.delete('issues');
    }
    

    return this.issueService.deleteIssue(id);
  }

  // 답변 작성
  @Post('answer')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async writeAnswer(
    @Body() data: any,
  ): Promise<ResponseIssueDto> {
    const cache = await this.redisService.get('issues');

    if (cache) {
      this.redisService.delete('issues');
    }
    return this.issueService.writeAnswer(data.id, data.response);
  }

  // 답변 수정
  @Post('answer/update')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async updateAnswer(
    @Body() data: any,
  ): Promise<ResponseIssueDto> {
    const cache = await this.redisService.get('issues');

    if (cache) {
      this.redisService.delete('issues');
    }

    return this.issueService.updateAnswer(data.id, data.response);
  }

  // 모든 답변 조회
  @Get('answer/all')
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async getAllAnswer(): Promise<any> {
    return this.issueService.getAnsweredIssues();
  }
  
}
