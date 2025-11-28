import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../services/player/player';
import { ChatService } from '../../services/chat/chat';
import { AuthService } from '../../services/auth/auth.service';
import { ToastService } from '../../services/toast/toast';
import { Jogador } from '../../models/type';
import { Review } from '../../models/type';

@Component({
  selector: 'app-matchmaking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fadeIn">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">Encontre seu Duo ou Party Ideal</h1>
        <p class="text-slate-400">Conecte-se com jogadores compatíveis.</p>
      </div>

      <!-- ÁREA DE FILTROS -->
      <div class="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
             
             <!-- NOVO FILTRO: NOME -->
             <div>
                <label class="text-xs text-slate-400 block mb-1">Nome do Jogador</label>
                <input 
                    [(ngModel)]="filtroNome" 
                    (keyup.enter)="buscarJogadores()"
                    (blur)="buscarJogadores()" 
                    placeholder="Ex: Player1"
                    class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white placeholder-slate-600 focus:border-violet-500 outline-none">
             </div>

             <!-- FILTRO: JOGO -->
             <div>
                <label class="text-xs text-slate-400 block mb-1">Jogo</label>
                <select [ngModel]="filtroJogo" (ngModelChange)="onFiltroJogoChange($event)" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                    <option value="">Todos</option>
                    <option *ngFor="let j of jogosDisponiveis()" [value]="j">{{j}}</option>
                </select>
             </div>

             <!-- FILTRO: ESTILO -->
             <div>
                <label class="text-xs text-slate-400 block mb-1">Estilo</label>
                <select [ngModel]="filtroEstilo" (ngModelChange)="onFiltroEstiloChange($event)" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                    <option value="">Todos</option>
                    <option value="Competitivo">Competitivo</option>
                    <option value="Casual">Casual</option>
                    <option value="For Fun">For Fun</option>
                </select>
             </div>

             <div class="flex items-end">
                <button (click)="limparFiltros()" class="w-full bg-slate-700 hover:bg-slate-600 text-white p-2 rounded transition-colors">Limpar Filtros</button>
             </div>
        </div>
      </div>

      <!-- GRID DE JOGADORES (Mantido igual) -->
      <div *ngIf="!loading()" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let jogador of jogadores()" class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-violet-500 transition-all group relative">
          <div (click)="abrirPerfil(jogador)" class="p-6 cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <img [src]="jogador.avatar || 'https://i.pravatar.cc/150'" class="w-16 h-16 rounded-full border-2 border-violet-500 object-cover">
                <div>
                  <h3 class="font-bold text-lg text-white group-hover:text-violet-400 transition-colors">{{ jogador.nome }}</h3>
                  <div class="flex text-yellow-400 text-sm">
                    <span *ngFor="let s of [1,2,3,4,5]" [class.text-slate-600]="s > (jogador.reputacao || 0)">★</span>
                    <span class="ml-2 text-slate-400 text-xs">({{ jogador.reputacao || 0 }})</span>
                  </div>
                </div>
              </div>
              <span class="px-2 py-1 rounded text-xs font-semibold border bg-slate-700 text-slate-300 border-slate-600">{{ jogador.estilo }}</span>
            </div>
            <p class="text-slate-300 text-sm mb-4 line-clamp-2">{{ jogador.bio }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span *ngFor="let jg of jogador.jogosFavoritos" class="text-xs bg-slate-900 text-slate-300 px-2 py-1 rounded border border-slate-700">{{ jg }}</span>
            </div>
            <div class="text-xs text-slate-400 text-center mt-2 font-bold text-violet-400">Clique para ver detalhes e reviews</div>
          </div>
          <div class="px-6 pb-6 pt-0">
             <button (click)="convidar(jogador); $event.stopPropagation()" class="w-full bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Convidar / Chat</button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!loading() && jogadores().length === 0" class="text-center py-12 text-slate-500">
        Nenhum jogador encontrado com estes filtros.
      </div>
    </div>

    <!-- MODAL DE PERFIL (Mantido igual, apenas ocultando código repetitivo) -->
    <div *ngIf="selectedPlayer()" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="fecharPerfil()"></div>
        <div class="relative bg-slate-800 w-full max-w-2xl rounded-xl border border-slate-600 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            <!-- ... Conteúdo do Modal (Igual ao anterior) ... -->
            <div class="p-6 bg-slate-900 flex gap-6 items-center border-b border-slate-700 shrink-0">
                <img [src]="selectedPlayer()?.avatar || 'https://i.pravatar.cc/150'" class="w-24 h-24 rounded-full border-4 border-violet-500 object-cover">
                <div class="flex-1">
                    <h2 class="text-3xl font-bold text-white">{{ selectedPlayer()?.nome }}</h2>
                    <p class="text-violet-400 font-medium">{{ selectedPlayer()?.estilo }}</p>
                    <div class="flex items-center gap-2 mt-1"><span class="text-yellow-400 text-lg">★ {{ selectedPlayer()?.reputacao || 0 }}</span><span class="text-slate-500 text-sm">({{ reviews().length }} avaliações)</span></div>
                </div>
                <button (click)="fecharPerfil()" class="text-slate-400 hover:text-white text-2xl">✕</button>
            </div>
            <div class="overflow-y-auto p-6 flex-1">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div><h3 class="text-slate-500 text-xs uppercase font-bold mb-2">Sobre</h3><p class="text-slate-300">{{ selectedPlayer()?.bio }}</p></div>
                    <div><h3 class="text-slate-500 text-xs uppercase font-bold mb-2">Favoritos</h3><div class="flex flex-wrap gap-2"><span *ngFor="let g of selectedPlayer()?.jogosFavoritos" class="bg-slate-700 text-white px-2 py-1 rounded text-xs">{{g}}</span></div><div class="mt-4"><h3 class="text-slate-500 text-xs uppercase font-bold mb-1">Disponibilidade</h3><p class="text-white">{{ selectedPlayer()?.disponibilidade }}</p></div></div>
                </div>
                <div class="border-t border-slate-700 pt-6">
                    <h3 class="text-white font-bold text-lg mb-4">Avaliações da Comunidade</h3>
                    <div class="space-y-4 mb-6">
                        <div *ngIf="reviews().length === 0" class="text-slate-500 italic text-sm">Nenhuma avaliação ainda. Seja o primeiro!</div>
                        <div *ngFor="let rev of reviews()" class="bg-slate-700/30 p-4 rounded-lg" [class.border]="rev.authorId === auth.currentUser()?.id" [class.border-emerald-500]="rev.authorId === auth.currentUser()?.id">
                            <div class="flex justify-between items-start mb-2"><span class="text-white font-bold text-sm">{{ rev.authorName }}<span *ngIf="rev.authorId === auth.currentUser()?.id" class="text-emerald-400 text-xs ml-2">(Você)</span></span><div class="flex text-yellow-400 text-xs"><span *ngFor="let s of [1,2,3,4,5]" [class.text-slate-600]="s > rev.rating">★</span></div></div><p class="text-slate-300 text-sm">{{ rev.comment }}</p>
                        </div>
                    </div>
                    <ng-container *ngIf="auth.currentUser() as user">
                        <div *ngIf="jaAvaliou()" class="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-center text-emerald-400 font-medium text-sm">✅ Você já avaliou este jogador. Obrigado por contribuir!</div>
                        <div *ngIf="user.id === selectedPlayer()?.id" class="p-4 bg-slate-700/30 rounded-lg text-center text-slate-400 text-sm">Você não pode avaliar a si mesmo.</div>
                        <div *ngIf="!jaAvaliou() && user.id !== selectedPlayer()?.id" class="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                            <h4 class="text-white font-bold text-sm mb-3">Deixar uma avaliação</h4>
                            <div class="flex gap-1 mb-3"><button *ngFor="let s of [1,2,3,4,5]" (click)="newReview.rating = s" class="text-2xl focus:outline-none transition-transform hover:scale-110" [class.text-yellow-400]="s <= newReview.rating" [class.text-slate-600]="s > newReview.rating">★</button></div>
                            <textarea [(ngModel)]="newReview.comment" rows="2" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm mb-3" placeholder="Escreva seu comentário sobre este jogador..."></textarea>
                            <button (click)="enviarReview()" [disabled]="submittingReview" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold disabled:opacity-50">{{ submittingReview ? 'Enviando...' : 'Publicar Avaliação' }}</button>
                        </div>
                    </ng-container>
                    <div *ngIf="!auth.currentUser()" class="text-center p-4 bg-slate-700/30 rounded text-slate-400 text-sm">Faça login para avaliar este jogador.</div>
                </div>
            </div>
            <div class="p-4 bg-slate-900 border-t border-slate-700 flex justify-end gap-3 shrink-0">
                <button (click)="convidar(selectedPlayer()!)" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg font-bold">Mandar Mensagem</button>
            </div>
        </div>
    </div>
  `
})
export class MatchmakingComponent implements OnInit {
  private playerService = inject(PlayerService);
  private chatService = inject(ChatService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  jogadores = signal<Jogador[]>([]);
  jogosDisponiveis = signal<string[]>([]);
  loading = signal(false);
  
  selectedPlayer = signal<Jogador | null>(null);
  reviews = signal<Review[]>([]);
  
  newReview = { rating: 5, comment: '' };
  submittingReview = false;

  filtroJogo = '';
  filtroEstilo = '';
  filtroNome = ''; // Novo filtro

  jaAvaliou = computed(() => {
    const user = this.auth.currentUser();
    const listaReviews = this.reviews();
    if (!user) return false;
    return listaReviews.some(r => r.authorId === user.id);
  });

  ngOnInit() {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais() {
    this.loading.set(true);
    this.playerService.getListaJogos().subscribe(g => this.jogosDisponiveis.set(g));
    this.buscarJogadores();
  }

  buscarJogadores() {
    this.loading.set(true);
    // Envia o novo filtroNome também
    this.playerService.filtrarJogadores(this.filtroJogo, this.filtroEstilo, this.filtroNome)
      .subscribe({
        next: (d) => { this.jogadores.set(d); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
  }

  abrirPerfil(player: Jogador) {
    this.selectedPlayer.set(player);
    this.carregarReviews(player.id);
    this.newReview = { rating: 5, comment: '' };
  }

  fecharPerfil() { this.selectedPlayer.set(null); }

  carregarReviews(targetId: number) {
    this.playerService.getReviews(targetId).subscribe(r => this.reviews.set(r));
  }

  enviarReview() {
    const user = this.auth.currentUser();
    const target = this.selectedPlayer();
    
    if (!user || !target) return;
    if (this.jaAvaliou()) { this.toast.error('Você já avaliou este jogador.'); return; }
    if (!this.newReview.comment.trim()) { this.toast.warning('Escreva um comentário.'); return; }

    this.submittingReview = true;
    
    const reviewPayload = {
        authorId: user.id,
        authorName: user.nome || 'Usuário',
        targetId: target.id,
        rating: this.newReview.rating,
        comment: this.newReview.comment
    };

    this.playerService.addReview(reviewPayload).subscribe({
        next: (reviewCriada) => {
            this.toast.success('Avaliação enviada!');
            this.reviews.update(r => [reviewCriada, ...r]);
            this.submittingReview = false;
            this.newReview = { rating: 5, comment: '' };
            this.buscarJogadores(); // Atualiza estrela na grid
        },
        error: (err) => {
            if (err.status === 400) this.toast.error(err.error.message || 'Você já avaliou.');
            else this.toast.error('Erro ao enviar.');
            setTimeout(() => { this.submittingReview = false; }, 0);
        }
    });
  }

  convidar(jogadorAlvo: Jogador) {
    if (!this.auth.currentUser()) { this.toast.error('Login necessário.'); return; }
    if (this.auth.currentUser()?.id === jogadorAlvo.id) { this.toast.warning('Não pode conversar consigo mesmo.'); return; }
    this.chatService.openChatWith(jogadorAlvo);
    this.fecharPerfil();
  }

  onFiltroJogoChange(v: string) { this.filtroJogo = v; this.buscarJogadores(); }
  onFiltroEstiloChange(v: string) { this.filtroEstilo = v; this.buscarJogadores(); }
  limparFiltros() { 
      this.filtroJogo = ''; 
      this.filtroEstilo = ''; 
      this.filtroNome = ''; // Limpa nome também
      this.buscarJogadores(); 
  }
}