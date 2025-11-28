import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entities/message.entity';
import { Block } from './entities/block.entity';
import { Player } from '../player/entities/player.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Message, Block, Player])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}