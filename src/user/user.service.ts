import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 유저 정보 조회
  async findById(id: number): Promise<User | null> {
    const result = await this.userRepository.findOne({ where: { id } });

    // 비밀번호 삭제
    if (result) {
      delete result.password;
    }

    return result;
  }

  // 이메일로 유저 찾기
  async findByEmail(email: string): Promise<User | null> {
    const result = await this.userRepository.findOne({ where: { email } });

    // 비밀번호 삭제
    if (result) {
      delete result.password;
    }

    return result;
  }

  // 유저 정보 수정
  async updateUser(id: number, updateData: UpdateUserDto): Promise<any> {
    if (!id || !updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestException('잘못된 업데이트 데이터 또는 ID 입니다.');
    }

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    // 업데이트 실행
    await this.userRepository.update(id, updateData);

    // 업데이트 후 최신 데이터 반환
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    if (updatedUser) {
      delete updatedUser.password; // 비밀번호 제거
    }

    return {
      message: '회원 정보 수정이 완료되었습니다.',
      status: HttpStatus.OK,
      updatedUser,
    };
  }

  // 유저 탈퇴
  async deleteUser(id: number): Promise<any> {
    await this.userRepository.delete(id);
    return { message: '회원 탈퇴가 완료되었습니다.', status: HttpStatus.OK };
  }

  // 비밀번호 번경
  async changePassword(id: number, password: string): Promise<any> {
    // 비밀번호 확인
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    // 기존 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 변경
    const newPassword = await bcrypt.hash(password, 10);
    await this.userRepository.update(id, { password: newPassword });

    return { message: '비밀번호 변경이 완료되었습니다.', status: HttpStatus.OK };
  }
}
