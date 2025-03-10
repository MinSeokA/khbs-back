import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Song } from './entity/song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('songs - Song API') // Swagger 태그 추가
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  // 모든 노래 조회
  @Get()
  @ApiOkResponse({ description: '모든 노래 목록 반환', type: [Song] })
  async findAll(): Promise<Song[]> {
    return this.songsService.findAll();
  }

  // 특정 노래 조회
  @Get(':id')
  @ApiOkResponse({ description: '특정 노래 반환', type: Song })
  @ApiNotFoundResponse({ description: '노래를 찾을 수 없음' })
  async findOne(@Param('id') id: number): Promise<Song> {
    return this.songsService.findOne(id);
  }

  // 노래 추가
  @Post()
  @ApiCreatedResponse({ description: '노래 추가 성공', type: Song })
  @ApiBadRequestResponse({ description: '잘못된 요청 데이터' })
  async create(@Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songsService.create(createSongDto);
  }

  // 노래 삭제
  @Delete(':id')
  @ApiOkResponse({ description: '노래 삭제 성공' })
  @ApiNotFoundResponse({ description: '노래를 찾을 수 없음' })
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Req() req: Request, @Param('id') id: number): Promise<void> {
    return this.songsService.remove(req, id);
  }

  // 노래 수정
  @Post('status/:id')
  @ApiOkResponse({ description: '노래 수정 성공' })
  @ApiNotFoundResponse({ description: '노래를 찾을 수 없음' })
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async update(
    @Req() req: Request,
    @Param('id') id: number,
    @Body() updateSongDto: UpdateSongDto,
  ): Promise<void> {
    return this.songsService.updateStatus(req, id, updateSongDto.status);
  }
}