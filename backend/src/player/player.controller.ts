import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PlayersService } from './player.service';
import { CreatePlayerDto, LoginDto } from './dto/player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(
    @Query('jogo') jogo?: string,
    @Query('estilo') estilo?: string,
    @Query('nome') nome?: string,
  ): Promise<Player[]> { 
    // Se vier qualquer parâmetro, chama o filtro
    if (jogo || estilo || nome) {
      return this.playersService.filtrar(jogo, estilo, nome);
    }
    // Se não, retorna tudo
    return this.playersService.findAll();
  }

  @Get('lists/games')
  getGamesList(): Promise<string[]> {
    return this.playersService.getUniqueGames();
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<Player> {
    return this.playersService.login(loginDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Post()
  create(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
    return this.playersService.create(createPlayerDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto
  ): Promise<Player> {
    return this.playersService.update(id, updatePlayerDto);
  }
  
}