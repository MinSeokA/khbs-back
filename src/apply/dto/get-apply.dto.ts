import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class GetApplyByStudentIdAndPasswordDto {
  @IsNumber({}, { message: '학번은 숫자여야 합니다.' })
  @IsNotEmpty({ message: '학번은 필수 항목입니다.' })
  studentId: number;

  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
  password: string;
}
