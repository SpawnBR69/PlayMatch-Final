import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
// Importe o Player
import { Player } from '../player/entities/player.entity';

@Module({
  // Adicione Player ao TypeOrmModule
  imports: [TypeOrmModule.forFeature([Group, Player])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}