import { Component, inject, signal, effect, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat/chat';
import { AuthService } from '../../services/auth/auth.service';
import { Message,Jogador } from '../../models/type';
import { ToastService } from '../../services/toast/toast';
import { ConfirmationService } from '../../services/confirmation/confirmation';

@Component({
  selector: 'app-chat-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="chatService.isSidebarOpen()" (click)="chatService.toggleSidebar()" class="fixed inset-0 bg-black/50 z-40 lg:hidden"></div>

    <div [class.translate-x-0]="chatService.isSidebarOpen()" 
         [class.-translate-x-full]="!chatService.isSidebarOpen()"
         class="fixed top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-slate-900 border-r border-slate-700 z-40 transition-transform duration-300 flex flex-col shadow-2xl">
      
      <!-- Cabeçalho -->
      <div class="p-4 border-b border-slate-700 bg-slate-800 flex justify-between items-center">
        <h3 class="font-bold text-white">
            {{ chatService.activeChatUser() ? 'Conversa' : 'Mensagens' }}
        </h3>
        <button (click)="chatService.toggleSidebar()" class="text-slate-400 hover:text-white font-bold text-xl">×</button>
      </div>

      <!-- ESTADO 1: LISTA DE CONTATOS (Quando nenhum chat está aberto) -->
      <div *ngIf="!chatService.activeChatUser()" class="flex-1 overflow-y-auto bg-slate-900">
        
        <!-- Lista de contatos recentes -->
        <div *ngIf="recentContacts().length > 0" class="divide-y divide-slate-800">
             <div *ngFor="let contact of recentContacts()" 
                  (click)="chatService.openChatWith(contact)"
                  class="p-4 flex items-center gap-3 hover:bg-slate-800 cursor-pointer transition-colors group">
                
                <div class="relative">
                    <img [src]="contact.avatar || 'https://i.pravatar.cc/150'" class="w-10 h-10 rounded-full border border-slate-600 group-hover:border-violet-500">
                    <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                
                <div class="flex-1 min-w-0">
                    <h4 class="text-white font-medium text-sm truncate">{{ contact.nome }}</h4>
                    <p class="text-slate-500 text-xs truncate">{{ contact.estilo }}</p>
                </div>
                
                <div class="text-slate-600 text-lg group-hover:text-violet-500">›</div>
             </div>
        </div>

        <!-- Lista Vazia -->
        <div *ngIf="recentContacts().length === 0" class="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
            <div class="text-4xl mb-3">👋</div>
            <p class="text-slate-300 font-bold mb-1">Nada por aqui</p>
            <p class="text-slate-500 text-xs">Suas conversas recentes aparecerão aqui.</p>
        </div>
      </div>

      <!-- ESTADO 2: CHAT ATIVO (Código anterior mantido) -->
      <div *ngIf="chatService.activeChatUser() as targetUser" class="flex-1 flex flex-col h-full overflow-hidden animate-fadeIn">
        
        <div class="p-3 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2 overflow-hidden">
                <button (click)="fecharChat()" class="mr-1 text-slate-400 hover:text-white">←</button>
                <img [src]="targetUser.avatar || 'https://i.pravatar.cc/150'" class="w-8 h-8 rounded-full border border-slate-600">
                <span class="text-sm font-bold text-white truncate max-w-[120px]">{{ targetUser.nome }}</span>
            </div>
            <button (click)="bloquear(targetUser.id)" class="text-xs text-red-400 hover:text-red-300 bg-slate-700/50 px-2 py-1 rounded" title="Bloquear">🚫</button>
        </div>

        <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900">
            <div *ngFor="let msg of messages()" [class.text-right]="msg.senderId === auth.currentUser()?.id">
                <div [class]="msg.senderId === auth.currentUser()?.id ? 'bg-violet-600 text-white rounded-l-lg rounded-tr-lg' : 'bg-slate-700 text-slate-200 rounded-r-lg rounded-tl-lg'"
                     class="inline-block p-2 text-sm max-w-[85%] break-words text-left">
                    {{ msg.content }}
                </div>
                <div class="text-[10px] text-slate-500 mt-1 mr-1">
                    {{ msg.createdAt | date:'HH:mm' }}
                </div>
            </div>
        </div>

        <div class="p-3 border-t border-slate-700 bg-slate-800 shrink-0">
            <form (ngSubmit)="enviarMensagem()" class="flex gap-2">
                <input [(ngModel)]="novoTexto" name="msg" [disabled]="bloqueando" autocomplete="off" placeholder="Digite..." class="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:border-violet-500 outline-none">
                <button type="submit" [disabled]="!novoTexto.trim() || bloqueando" class="bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded transition-colors disabled:opacity-50 font-bold">➤</button>
            </form>
            <p *ngIf="erroEnvio" class="text-red-400 text-xs mt-2 text-center">{{ erroEnvio }}</p>
        </div>
      </div>
    </div>
  `
})
export class ChatSidebarComponent implements OnDestroy {
  chatService = inject(ChatService);
  auth = inject(AuthService);
  toast = inject(ToastService);
  confirmation = inject(ConfirmationService);

  messages = signal<Message[]>([]);
  recentContacts = signal<Jogador[]>([]); // Nova lista de contatos

  novoTexto = '';
  erroEnvio = '';
  bloqueando = false;
  pollingInterval: any;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    // Efeito para carregar contatos quando a barra abre
    effect(() => {
        if (this.chatService.isSidebarOpen() && !this.chatService.activeChatUser()) {
            this.carregarContatos();
        }
    });

    // Efeito para carregar mensagens quando um chat é selecionado
    effect(() => {
      const target = this.chatService.activeChatUser();
      const me = this.auth.currentUser();
      
      if (this.pollingInterval) clearInterval(this.pollingInterval);

      if (target && me) {
        this.carregarConversa(me.id, target.id);
        this.pollingInterval = setInterval(() => {
           this.carregarConversa(me.id, target.id, false);
        }, 3000);
      } else {
        this.messages.set([]);
        // Se fechou o chat, recarrega a lista de contatos para atualizar a ordem
        if (me) this.carregarContatos();
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }

  carregarContatos() {
      const user = this.auth.currentUser();
      if (!user) return;
      
      this.chatService.getContacts(user.id).subscribe({
          next: (contacts) => this.recentContacts.set(contacts),
          error: (err) => console.error('Erro ao carregar contatos', err)
      });
  }

  carregarConversa(meId: number, targetId: number, autoScroll = true) {
    this.chatService.getConversation(meId, targetId).subscribe(msgs => {
      const totalMensagensAntes = this.messages().length;
      this.messages.set(msgs);
      if (autoScroll || msgs.length > totalMensagensAntes) {
        this.scrollToBottom();
      }
    });
  }

  enviarMensagem() {
    const me = this.auth.currentUser();
    const target = this.chatService.activeChatUser();
    if (!me || !target || !this.novoTexto.trim()) return;

    this.erroEnvio = '';
    const texto = this.novoTexto;
    this.novoTexto = '';
    
    this.chatService.sendMessage(me.id, target.id, texto).subscribe({
      next: (msg) => {
        this.messages.update(lista => [...lista, msg]);
        this.scrollToBottom();
      },
      error: (err) => {
        this.novoTexto = texto;
        this.erroEnvio = err.error.message || 'Erro ao enviar.';
      }
    });
  }

  async bloquear(targetId: number) {
    const me = this.auth.currentUser();
    if (!me) return;

    // Substitui o confirm() pelo nosso modal
    const confirmou = await this.confirmation.confirm({
        title: 'Bloquear Usuário',
        message: 'Tem certeza? Você deixará de receber mensagens deste usuário e ele não poderá te ver.',
        confirmText: 'Sim, Bloquear',
        type: 'danger'
    });

    if (!confirmou) return;

    this.bloqueando = true;
    this.chatService.bloquearUsuario(me.id, targetId).subscribe({
      next: () => {
        this.fecharChat();
        this.bloqueando = false;
      },
      error: () => this.bloqueando = false
    });
  }

  fecharChat() {
    this.chatService.activeChatUser.set(null);
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}