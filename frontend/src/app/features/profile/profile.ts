import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Jogador } from '../../models/type';
import { ChatService } from '../../services/chat/chat';
import { ToastService } from '../../services/toast/toast';
import { ConfirmationService } from '../../services/confirmation/confirmation';
import { PlayerService } from '../../services/player/player';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fadeIn max-w-2xl mx-auto">
      
      <!-- ESTADO 1: USUÁRIO LOGADO -->
      <div *ngIf="auth.currentUser() as user" class="bg-slate-800 rounded-xl border border-slate-700 p-8 relative">
        
        <button (click)="toggleEditMode(user)" class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors">
            <span *ngIf="!isEditing()">✏️ Editar Perfil</span>
            <span *ngIf="isEditing()" class="text-red-400">✖ Cancelar</span>
        </button>

        <!-- CABEÇALHO -->
        <div class="text-center mb-6">
          <div class="relative inline-block">
            <img [src]="editData.avatar || user.avatar || 'https://i.pravatar.cc/150'" class="w-32 h-32 rounded-full border-4 border-violet-500 object-cover mx-auto">
            <div *ngIf="isEditing()" class="mt-2">
                <input [(ngModel)]="editData.avatar" placeholder="URL da imagem" class="bg-slate-900 border border-slate-600 rounded p-1 text-xs text-white w-full">
            </div>
          </div>
          <h2 class="text-2xl font-bold text-white mt-4">{{ user.nome }}</h2>
          <div *ngIf="!isEditing()" class="text-violet-400 font-medium">{{ user.estilo }}</div>
          <select *ngIf="isEditing()" [(ngModel)]="editData.estilo" class="mt-2 bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm">
            <option value="Casual">Casual</option>
            <option value="Competitivo">Competitivo</option>
            <option value="For Fun">For Fun</option>
          </select>
        </div>

        <!-- DETALHES -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
          <div class="bg-slate-900 p-4 rounded-lg">
            <span class="text-slate-500 block mb-1">Disponibilidade</span>
            <span *ngIf="!isEditing()" class="text-white font-bold">{{ user.disponibilidade }}</span>
            <input *ngIf="isEditing()" [(ngModel)]="editData.disponibilidade" class="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white" placeholder="Ex: Noite, Finais de Semana">
          </div>
          
          <div class="bg-slate-900 p-4 rounded-lg relative"> <!-- Relative para o dropdown funcionar -->
            <span class="text-slate-500 block mb-1">Jogos Favoritos</span>
            
            <div *ngIf="!isEditing()" class="flex flex-wrap gap-2">
                <span *ngFor="let jogo of user.jogosFavoritos" class="bg-violet-600/20 text-violet-300 px-2 py-1 rounded text-xs border border-violet-600/30">
                    {{ jogo }}
                </span>
            </div>

            <div *ngIf="isEditing()">
                <div class="flex flex-wrap gap-2 mb-2">
                    <span *ngFor="let jogo of editData.jogosFavoritos; let i = index" class="bg-violet-600/20 text-violet-300 px-2 py-1 rounded text-xs border border-violet-600/30 flex items-center gap-1">
                        {{ jogo }} <button (click)="removerJogo(i)" class="text-red-400 ml-1">×</button>
                    </span>
                </div>
                
                <div class="flex gap-2 relative">
                    <!-- INPUT COM AUTOCOMPLETE -->
                    <input 
                        [(ngModel)]="novoJogoInput" 
                        (input)="filtrarSugestoes()" 
                        (keyup.enter)="adicionarJogo()" 
                        placeholder="Novo jogo..." 
                        class="flex-1 bg-slate-800 border border-slate-600 rounded p-1 text-xs text-white"
                        autocomplete="off"> <!-- Desliga autocomplete nativo do browser -->
                    
                    <button (click)="adicionarJogo()" class="bg-emerald-600 text-white px-2 rounded text-xs">Add</button>

                    <!-- LISTA SUSPENSA DE SUGESTÕES -->
                    <ul *ngIf="sugestoesVisiveis.length > 0 && novoJogoInput.length > 0" class="absolute top-full left-0 w-full bg-slate-800 border border-slate-600 rounded mt-1 z-50 max-h-40 overflow-y-auto shadow-xl">
                        <li *ngFor="let sugestao of sugestoesVisiveis" 
                            (click)="selecionarSugestao(sugestao)"
                            class="px-3 py-2 text-xs text-white hover:bg-violet-600 cursor-pointer border-b border-slate-700 last:border-0">
                            {{ sugestao }}
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        </div>

        <div class="bg-slate-900 p-4 rounded-lg mb-8">
          <h3 class="text-slate-400 text-xs uppercase font-bold mb-2">Biografia</h3>
          <p *ngIf="!isEditing()" class="text-slate-300">{{ user.bio }}</p>
          <textarea *ngIf="isEditing()" [(ngModel)]="editData.bio" rows="3" class="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white text-sm"></textarea>
        </div>

        <!-- Blocklist e Botões (Mantidos) -->
        <div *ngIf="!isEditing()" class="mb-8 border-t border-slate-700 pt-6">
            <button (click)="toggleBlocklist(user.id)" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                <span>🚫 Gerenciar Usuários Bloqueados</span>
                <span class="text-xs transform transition-transform" [class.rotate-180]="showBlocklist()">▼</span>
            </button>
            <div *ngIf="showBlocklist()" class="mt-4 bg-slate-900 rounded-lg p-2 animate-fadeIn">
                <p *ngIf="loadingBlocks()" class="text-center text-slate-500 text-xs p-2">Carregando...</p>
                <div *ngIf="!loadingBlocks() && blockedUsers().length === 0" class="text-center text-slate-500 text-sm p-4">Você não bloqueou ninguém.</div>
                <div *ngFor="let blocked of blockedUsers()" class="flex items-center justify-between p-3 border-b border-slate-800 last:border-0">
                    <span class="text-slate-300 text-sm line-through decoration-slate-500">{{ blocked.nome }}</span>
                    <button (click)="desbloquear(user.id, blocked.id)" class="text-xs bg-slate-700 hover:bg-emerald-600 hover:text-white text-slate-300 px-3 py-1.5 rounded transition-colors">Desbloquear</button>
                </div>
            </div>
        </div>

        <div *ngIf="isEditing()" class="flex gap-4 mb-4">
            <button (click)="salvarAlteracoes(user.id)" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold transition-colors">Salvar Alterações</button>
        </div>

        <button *ngIf="!isEditing()" (click)="auth.logout()" class="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-lg font-bold transition-colors">
          Sair da Conta (Logout)
        </button>
      </div>

      <!-- Formulários de Login/Cadastro (Mantidos, código oculto para brevidade) -->
      <div *ngIf="!auth.currentUser()" class="bg-slate-800 rounded-xl border border-slate-700 p-8">
         <div class="flex border-b border-slate-700 mb-6">
          <button (click)="isRegistering.set(false)" [class]="!isRegistering() ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400'" class="flex-1 pb-4 font-bold transition-colors">Login</button>
          <button (click)="isRegistering.set(true)" [class]="isRegistering() ? 'text-violet-400 border-b-2 border-violet-400' : 'text-slate-400'" class="flex-1 pb-4 font-bold transition-colors">Criar Conta</button>
        </div>
        <form *ngIf="!isRegistering()" (ngSubmit)="fazerLogin()" class="space-y-4">
          <div><label class="block text-slate-400 text-sm mb-1">Email</label><input [(ngModel)]="loginData.email" name="email" type="email" class="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white"></div>
          <div><label class="block text-slate-400 text-sm mb-1">Senha</label><input [(ngModel)]="loginData.senha" name="senha" type="password" class="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white"></div>
          <button type="submit" class="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg font-bold mt-4">Entrar</button>
        </form>
        <form *ngIf="isRegistering()" (ngSubmit)="fazerCadastro()" class="space-y-4">
             <div><label class="block text-slate-400 text-sm mb-1">Nome</label><input [(ngModel)]="registerData.nome" name="nome" class="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white"></div>
             <div><label class="block text-slate-400 text-sm mb-1">Email</label><input [(ngModel)]="registerData.email" name="email" type="email" class="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white"></div>
             <div><label class="block text-slate-400 text-sm mb-1">Senha</label><input [(ngModel)]="registerData.senha" name="senha" type="password" class="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white"></div>
             <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold mt-4">Cadastrar</button>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  chatService = inject(ChatService);
  playerService = inject(PlayerService); // Injeção nova
  
  isRegistering = signal(false);
  isEditing = signal(false);
  
  showBlocklist = signal(false);
  loadingBlocks = signal(false);
  blockedUsers = signal<Jogador[]>([]);
  errorMessage = signal('');

  loginData = { email: '', senha: '' };
  editData: Partial<Jogador> = {};
  registerData = { nome: '', email: '', senha: '', estilo: 'Casual', bio: '', avatar: 'https://i.pravatar.cc/150', plataformas: ['PC'], jogosFavoritos: ['Geral'], disponibilidade: 'Noite', reputacao: 0 };

  // --- VARIÁVEIS PARA AUTOCOMPLETE ---
  novoJogoInput = '';
  todosJogos: string[] = []; // Lista carregada do backend
  sugestoesVisiveis: string[] = [];
  // -----------------------------------

  constructor() {
      // Carrega a lista completa de jogos para usar no autocomplete
      this.playerService.getListaJogos().subscribe(jogos => {
          this.todosJogos = jogos;
      });
  }

  // --- LÓGICA DE AUTOCOMPLETE ---
  filtrarSugestoes() {
      if (!this.novoJogoInput) {
          this.sugestoesVisiveis = [];
          return;
      }
      const termo = this.novoJogoInput.toLowerCase();
      // Filtra os jogos que contém o termo e que o usuário AINDA NÃO tem na lista de edição
      this.sugestoesVisiveis = this.todosJogos.filter(jogo => 
          jogo.toLowerCase().includes(termo) && 
          !this.editData.jogosFavoritos?.includes(jogo)
      );
  }

  selecionarSugestao(jogo: string) {
      this.novoJogoInput = jogo;
      this.adicionarJogo();
      this.sugestoesVisiveis = []; // Esconde a lista
  }
  // ------------------------------

  fazerLogin() {
    this.auth.login(this.loginData.email, this.loginData.senha).subscribe({
      next: () => this.errorMessage.set(''),
      error: () => this.errorMessage.set('Email ou senha inválidos!')
    });
  }

  fazerCadastro() {
    this.auth.register(this.registerData).subscribe({
      next: (user) => {
        this.errorMessage.set('');
        // Ativa o modo de edição imediatamente
        this.toggleEditMode(user);
      },
      error: (err) => this.errorMessage.set('Erro ao criar conta.')
    });
  }

  toggleEditMode(user: Jogador) {
    if (this.isEditing()) {
      this.isEditing.set(false);
    } else {
      this.editData = JSON.parse(JSON.stringify(user));
      this.isEditing.set(true);
      this.showBlocklist.set(false);
    }
  }

  adicionarJogo() {
    if (this.novoJogoInput.trim()) {
      if (!this.editData.jogosFavoritos) this.editData.jogosFavoritos = [];
      
      // Evita duplicatas
      if (!this.editData.jogosFavoritos.includes(this.novoJogoInput.trim())) {
          this.editData.jogosFavoritos.push(this.novoJogoInput.trim());
      }
      
      this.novoJogoInput = '';
      this.sugestoesVisiveis = []; // Limpa sugestões
    }
  }

  removerJogo(index: number) {
    if (this.editData.jogosFavoritos) this.editData.jogosFavoritos.splice(index, 1);
  }

  salvarAlteracoes(userId: number) {
    this.auth.updateProfile(userId, this.editData).subscribe({
      next: () => this.isEditing.set(false),
      error: () => alert('Erro ao salvar.')
    });
  }

  toggleBlocklist(userId: number) {
      if (this.showBlocklist()) { this.showBlocklist.set(false); } 
      else { this.showBlocklist.set(true); this.carregarBloqueios(userId); }
  }

  carregarBloqueios(userId: number) {
      this.loadingBlocks.set(true);
      this.chatService.getBlockedList(userId).subscribe({
          next: (users) => { this.blockedUsers.set(users); this.loadingBlocks.set(false); },
          error: () => this.loadingBlocks.set(false)
      });
  }

  desbloquear(myId: number, blockedId: number) {
      if(!confirm('Deseja desbloquear?')) return;
      this.chatService.desbloquearUsuario(myId, blockedId).subscribe({
          next: () => this.blockedUsers.update(list => list.filter(u => u.id !== blockedId)),
          error: () => alert('Erro.')
      });
  }
}