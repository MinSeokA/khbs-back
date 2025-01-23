import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-userdto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    // 데이터베이스, jwt 모듈 등을 주입
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 회원가입 기본 정보만 저장
  async createUser(user: CreateUserDto): Promise<any> {
    // user에 body로 받은 정보가 없으면 오류 메시지 반환, email, username, password는 필수
    const userData = ['email', 'name', 'password'].filter(
      (data) => !user[data],
    );
    if (!user.email || !user.name || !user.password) {
      throw new BadRequestException(`데이터에 ${userData.join(', ')}(이)가 누락되었습니다.`);
    }

    // 이미 가입된 이메일인지 확인
    const findUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (findUser) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    user.password = await this.hashPassword(user.password);

    await this.userRepository.save(user);

    return user
  }

  // 로그인 JWT 사용
  async login(user: LoginUserDto): Promise<any> {
    // user에 body로 받은 정보가 없으면 오류 메시지 반환, email, username, password는 필수
    const userData = ['email', 'password'].filter((data) => !user[data]);
    if (!user.email || !user.password) {
      throw new BadRequestException(`데이터에 ${userData.join(', ')}(이)가 누락되었습니다.`);
    }

    const findUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!findUser) {
      throw new NotFoundException('가입되지 않은 이메일입니다.');
    }

    const isMatch = await this.validateUser(user.email, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    // jwt token
    const payload = { 
      email: user.email, 
      sub: findUser.id, 
      // Convert the array of strings to a single string before applying the replace method
      roles: JSON.parse(findUser.roles.join('').replace(/\\\"/g, '"'))
    };
    return {
      message: '로그인에 성공하였습니다.',
      status: HttpStatus.OK,
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      }),
    };
  }

  // 사용자 정보를 검증하는 메서드
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 비밀번호가 일치하면 사용자 정보 반환
      const { password, ...result } = user;
      return result;
    }

    // 비밀번호가 일치하지 않으면 오류 메시지 반환
    return null;
  }

  // 비밀번호 암호화 Bcryptjs 사용
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(password, salt);
  }

  // 로그아웃
  async logout() {
    return {
      message: '로그아웃에 성공하였습니다.',
      status: HttpStatus.OK,
    };
  }
}

