import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateSongDto {
  @IsNumber()
  @IsNotEmpty()
  status: number;
}