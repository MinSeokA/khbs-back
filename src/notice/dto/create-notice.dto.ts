import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoticeDto {
  @IsString({ message: '제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '제목은 필수 항목입니다.' })
  title: string;

  @IsString({ message: '내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '내용은 필수 항목입니다.' })
  content: string;

  @IsString({ message: '작성자는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '작성자는 필수 항목입니다.' })
  author: string;

  @IsOptional()
  image: string;

  @IsOptional()
  createdAt: Date;
}