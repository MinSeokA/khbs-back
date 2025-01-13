import { Transform } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class applyDto {
  // 학생 정보
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '이름은 필수 항목입니다.' })
  name: string; // 학생 이름

  @IsNumber({}, { message: '학번은 숫자여야 합니다.' })
  @IsNotEmpty({ message: '학번은 필수 항목입니다.' })
  studentId: number; // 학생 학번

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
  password: string; // 학생 비밀번호

  @IsPhoneNumber('KR', { message: '전화번호는 유효한 한국 전화번호여야 합니다.' })
  @IsNotEmpty({ message: '전화번호는 필수 항목입니다.' })
  phoneNumber: number; // 학생 전화번호

  @Transform(({ value }) => new Date(value)) // 문자열을 Date 객체로 변환
  @IsDate({ message: '면접일은 유효한 날짜 형식이어야 합니다. - 예시: 2025-01-11' })
  interviewDate: Date; // 면접일

  @IsString({ message: '지원 동기는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '지원 동기는 필수 항목입니다.' })
  applyReason: string; // 지원 동기

  @IsString({ message: '하고 싶은 말은 문자열이어야 합니다.' })
  comment: string; // 하고 싶은 말
}
