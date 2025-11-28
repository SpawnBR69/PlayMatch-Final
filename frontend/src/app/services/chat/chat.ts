import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Jogador } from '../../models/type';
import { PlayerService } from '../player/player';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'https://backend-playmatch-n9yw.onrender.com/api/chat';

  isSidebarOpen = signal(false);
  activeChatUser = signal<Jogador | null>(null);

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  openChatWith(user: Jogador) {
    this.activeChatUser.set(user);
    this.isSidebarOpen.set(true);
  }

  sendMessage(senderId: number, receiverId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, { senderId, receiverId, content });
  }

  getConversation(userA: number, userB: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversation`, { 
      params: { userA, userB } 
    });
  }

  bloquearUsuario(blockerId: number, blockedId: number) {
    return this.http.post(`${this.apiUrl}/block`, { blockerId, blockedId });
  }

  // --- ATUALIZADO: Agora retorna Jogador[] ---
  getContacts(userId: number): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(`${this.apiUrl}/contacts`, { params: { userId }});
  }

  getBlockedList(userId: number): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(`${this.apiUrl}/blocks`, { params: { userId } });
  }

  desbloquearUsuario(blockerId: number, blockedId: number) {
    return this.http.delete(`${this.apiUrl}/blocks`, { 
      params: { blockerId, blockedId } 
    });
  }
}