import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersController } from './player.controller';
import { PlayersService } from './player.service';
import { Player } from './entities/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player])], // Registra a entidade Player neste módulo
  controllers: [PlayersController],
  providers: [PlayersService],
})
export class PlayersModule {}