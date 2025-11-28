import { Controller, Get, Post, Body, Query, Delete, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(
    @Body('senderId') senderId: number,
    @Body('receiverId') receiverId: number,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(senderId, receiverId, content);
  }

  @Get('conversation')
  getConversation(
    @Query('userA') userA: number,
    @Query('userB') userB: number,
  ) {
    return this.chatService.getConversation(Number(userA), Number(userB));
  }

  @Post('block')
  blockUser(
    @Body('blockerId') blockerId: number,
    @Body('blockedId') blockedId: number,
  ) {
    return this.chatService.blockUser(blockerId, blockedId);
  }

  @Get('contacts')
  getContacts(@Query('userId') userId: number) {
    return this.chatService.getContacts(Number(userId));
  }

  @Get('blocks')
  getBlockedUsers(@Query('userId') userId: number) {
    return this.chatService.getBlockedUsers(Number(userId));
  }

  // DELETE /api/chat/blocks?blockerId=1&blockedId=2
  @Delete('blocks')
  unblockUser(
    @Query('blockerId') blockerId: number,
    @Query('blockedId') blockedId: number
  ) {
    return this.chatService.unblockUser(Number(blockerId), Number(blockedId));
  }
}