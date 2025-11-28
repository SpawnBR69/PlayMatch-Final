import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';

@Controller('api/groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll(
    @Query('status') status: 'upcoming' | 'past' | 'all',
    @Query('nome') nome?: string,
    @Query('jogo') jogo?: string,
    @Query('inicio') inicio?: string,
    @Query('fim') fim?: string,
  ): Promise<Group[]> {
    return this.groupsService.findAll(status, { nome, jogo, inicio, fim });
  }

  // --- NOVA ROTA ---
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.findOneWithMembers(id);
  }
  // ----------------

  @Post(':id/join')
  join(
    @Param('id', ParseIntPipe) groupId: number,
    @Body('playerId') playerId: number
  ): Promise<Group> {
    return this.groupsService.joinGroup(groupId, playerId);
  }
}