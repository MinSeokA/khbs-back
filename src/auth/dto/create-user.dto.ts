import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수 항목입니다.' })
  name: string;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  password: string;

  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
  email: string;

  roles: string[];
}
