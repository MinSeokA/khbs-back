import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate, IsIn, IsInt } from 'class-validator';

export class CreateScheduleDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 입력 값입니다.' })
  title: string; // 방송 일정 제목

  @IsString({ message: '작성자는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '작성자는 필수 입력 값입니다.' })
  author: string; // 작성자

  @IsString({ message: '교시 정보는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '교시 정보는 필수 입력 값입니다.' })
  period?: string; // 교시 정보
  
  @Transform(({ value }) => new Date(value)) // 문자열을 Date 객체로 변환
  @IsDate({ message: '날짜는 올바른 날짜 형식이어야 합니다.' })
  @IsNotEmpty({ message: '날짜는 필수 입력 값입니다.' })
  date: Date; // 방송 날짜

  @IsInt({ message: '상태는 정수로 입력해야 합니다.' })
  @IsIn([0, 1, 2], { message: '상태는 0 (예정), 1 (진행 중), 2 (완료) 중 하나여야 합니다.' })
  @IsNotEmpty({ message: '상태 값은 필수 입력 값입니다.' })
  @Transform(({ value }) => parseInt(value))
  status: number
}


