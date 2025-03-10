import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDto } from './dto/create-apply.dto';
import { Apply } from './entity/apply.entity';
import * as bcrypt from 'bcrypt';
import { LogsService } from '../logs/logs.service';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(Apply)
    private readonly applyRepository: Repository<Apply>,
    private readonly logsService: LogsService, // LogsService 주입
  ) {}

  // 지원서 작성
  async writeApply(apply: applyDto): Promise<any> {
    // apply에 body로 받은 정보가 없으면 오류 메시지 반환, email, username, password는 필수
    const applyData = ['name', 'studentId', 'phoneNumber', 'interviewDate', 'applyReason'].filter(
      (data) => !apply[data],
    );
    if (!apply.name || !apply.studentId || !apply.phoneNumber || !apply.interviewDate || !apply.applyReason) {
      throw new BadRequestException(`데이터에 ${applyData.join(', ')}(이)가 누락되었습니다.`);
    }
    const hashedPassword = await bcrypt.hash(apply.password, 10);
    if (typeof apply.password !== 'string' || typeof hashedPassword !== 'string') {
      throw new BadRequestException('비밀번호 형식이 잘못되었습니다.');
    }
    apply.password = hashedPassword;

    const newapply = await this.applyRepository.save(apply);
    if (!newapply) {
      throw new ConflictException('지원서 작성에 실패했습니다.');
    }
    if (newapply.password) {
      delete newapply.password;
    }

    return {
      ...newapply,
      message: '지원서 작성 완료',
      status: HttpStatus.OK,
    };
  }

  // 지원서 전체조회
  async getApply(): Promise<any> {
    const applys = await this.applyRepository.find();
    if (!applys || applys.length === 0) {
      throw new NotFoundException('지원서가 존재하지 않습니다.');
    }
    return applys;
  }

  // 지원서 조회
  async getApplyById(id: number): Promise<any> {
    const apply = await this.applyRepository.findOne({ where: { id } });
    if (!apply) {
      throw new NotFoundException('해당 지원서가 존재하지 않습니다.');
    }
    if (apply.password) {
      delete apply.password;
    }
    return apply;
  }

  // 지원서 수정
  async updateApply(req: any, id: number, apply: applyDto): Promise<any> {
    const data = await this.applyRepository.update(id, apply);
    if (data.affected === 0) {
      throw new NotFoundException('해당 지원서가 존재하지 않습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '지원서',
      action: '수정',
    });

    return {
      message: '지원서 수정 완료',
      status: HttpStatus.OK,
    };
  }

  // 지원서 삭제
  async deleteApply(req: any, id: number): Promise<any> {
    const data = await this.applyRepository.delete(id);
    if (data.affected === 0) {
      throw new NotFoundException('해당 지원서가 존재하지 않습니다.');
    }

    // 로그 생성
    await this.logsService.create({
      adminName: req.user.name,
      target: '지원서',
      action: '삭제',
    });

    return {
      message: '지원서 삭제 완료',
      status: HttpStatus.OK,
    };
  }

  // 학번 및 비밀번호로 지원서 조회
  async getApplyByStudentIdAndPassword(studentId: number, password: string): Promise<any> {
    // 학번으로 지원서 검색
    const apply = await this.applyRepository.findOne({ where: { studentId } });

    if (!apply) {
      throw new NotFoundException('해당 학번의 지원서가 존재하지 않습니다.');
    }
    // 비밀번호 및 저장된 비밀번호가 문자열인지 확인
    if (typeof password !== 'string' || typeof apply.password !== 'string') {
      throw new BadRequestException('비밀번호 형식이 잘못되었습니다.');
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, apply.password);

    if (!isMatch) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 필드 제거
    if (apply.password) {
      delete apply.password;
    }

    return apply;
  }
}