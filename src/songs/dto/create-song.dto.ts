import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CreateSongDto {
  @ApiProperty({ example: 'My Song', description: '노래 제목' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @IsNotEmpty({ message: '빈 값이 입력되었습니다.' })
  @Length(1, 255)
  title: string;

  @ApiProperty({ example: 'Artist Name', description: '가수 이름' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @IsNotEmpty({ message: '빈 값이 입력되었습니다.' })
  @Length(1, 255)
  artist: string;

  @ApiProperty({ example: 'Author Name', description: '작성자 이름' })
  @IsString({ message: '문자열을 입력해주세요.' })
  @IsNotEmpty({ message: '빈 값이 입력되었습니다.' })
  @Length(1, 255)
  author: string;

  @ApiProperty({ example: 'status', description: '상태' })
  status: number;
}