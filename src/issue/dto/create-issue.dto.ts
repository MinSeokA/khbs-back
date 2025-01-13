import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIssueDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
  title: string;

  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
  description: string;

  @IsString({ message: '위치는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '위치는 필수 항목입니다.' })
  location: string;
}