import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/groups/groups';
import { AuthService } from '../../services/auth/auth.service';
import { ConfirmationService } from '../../services/confirmation/confirmation';
import { PlayerService } from '../../services/player/player';
import { Grupo } from '../../models/type';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fadeIn">
        
        <!-- HEADER DE CONTROLE -->
        <div class="flex flex-col gap-4 mb-6">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 class="text-2xl font-bold text-white">Eventos & Esquadrões</h2>
                    <p class="text-slate-400 text-sm">Encontre sua próxima partida.</p>
                </div>
                
                <div class="flex flex-wrap gap-2 w-full md:w-auto">
                    <!-- Filtro Rápido -->
                    <select [ngModel]="filtroData" (ngModelChange)="onFiltroChange($event)" class="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                        <option value="upcoming">Próximos (Ativos)</option>
                        <option value="past">Passados</option>
                        <option value="all">Todos (Ativos no topo)</option>
                    </select>

                    <button (click)="toggleAdvancedFilters()" 
                            [class.bg-slate-700]="!showAdvancedFilters()" 
                            [class.bg-violet-600]="showAdvancedFilters()"
                            class="text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border border-slate-600">
                        <span class="text-lg">⚙️</span> Filtros
                    </button>

                    <button (click)="toggleForm()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors flex-shrink-0">
                        <span *ngIf="!showForm()">+ Criar</span>
                        <span *ngIf="showForm()">Cancelar</span>
                    </button>
                </div>
            </div>

            <!-- BARRA DE FILTROS AVANÇADOS (EXPANSÍVEL) -->
            <div *ngIf="showAdvancedFilters()" class="bg-slate-800 p-4 rounded-xl border border-slate-700 animate-fadeIn shadow-lg">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label class="block text-slate-400 text-xs mb-1">Nome do Evento</label>
                        <input [(ngModel)]="filtrosAvancados.nome" (keyup.enter)="aplicarFiltros()" placeholder="Ex: Campenato" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm">
                    </div>
                    
                    <!-- FILTRO JOGO COM AUTOCOMPLETE -->
                    <div class="relative">
                        <label class="block text-slate-400 text-xs mb-1">Jogo</label>
                        <input 
                            [(ngModel)]="filtrosAvancados.jogo" 
                            (input)="filtrarSugestoesFiltro()"
                            (keyup.enter)="aplicarFiltros()" 
                            placeholder="Ex: LoL" 
                            class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm"
                            autocomplete="off">
                        
                        <!-- Lista Suspensa do Filtro -->
                        <ul *ngIf="sugestoesVisiveisFiltro.length > 0 && filtrosAvancados.jogo.length > 0" class="absolute top-full left-0 w-full bg-slate-800 border border-slate-600 rounded mt-1 z-50 max-h-40 overflow-y-auto shadow-xl">
                            <li *ngFor="let sugestao of sugestoesVisiveisFiltro" 
                                (click)="selecionarSugestaoFiltro(sugestao)"
                                class="px-3 py-2 text-xs text-white hover:bg-violet-600 cursor-pointer border-b border-slate-700 last:border-0">
                                {{ sugestao }}
                            </li>
                        </ul>
                    </div>

                    <div>
                        <label class="block text-slate-400 text-xs mb-1">A partir de</label>
                        <input type="date" [(ngModel)]="filtrosAvancados.inicio" (change)="aplicarFiltros()" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm [color-scheme:dark]">
                    </div>
                    <div>
                        <label class="block text-slate-400 text-xs mb-1">Até</label>
                        <input type="date" [(ngModel)]="filtrosAvancados.fim" (change)="aplicarFiltros()" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white text-sm [color-scheme:dark]">
                    </div>
                </div>
                <div class="flex justify-end mt-4 gap-2">
                    <button (click)="limparFiltrosAvancados()" class="text-slate-400 text-sm hover:text-white px-3">Limpar</button>
                    <button (click)="aplicarFiltros()" class="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg text-sm font-bold">Buscar</button>
                </div>
            </div>
        </div>

        <!-- FORMULÁRIO DE CRIAÇÃO (COM AUTOCOMPLETE DE CRIAÇÃO) -->
        <div *ngIf="showForm()" class="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 animate-fadeIn">
            <h3 class="text-white font-bold mb-4">Novo Esquadrão</h3>
            
            <div *ngIf="!auth.currentUser()" class="text-center text-red-400 py-4 bg-red-500/10 rounded">
                Você precisa estar logado para criar um grupo.
            </div>

            <form *ngIf="auth.currentUser()" (ngSubmit)="criarGrupo()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                    <label class="block text-slate-400 text-xs mb-1">Título do Evento</label>
                    <input [(ngModel)]="novoGrupo.titulo" name="titulo" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" placeholder="Ex: Rankeds Diamante">
                </div>
                
                <!-- AUTOCOMPLETE DE CRIAÇÃO -->
                <div class="relative">
                    <label class="block text-slate-400 text-xs mb-1">Jogo</label>
                    <input 
                        [(ngModel)]="novoGrupo.jogo" 
                        name="jogo" 
                        (input)="filtrarSugestoesCriacao()" 
                        class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white" 
                        placeholder="Ex: Valorant"
                        autocomplete="off">
                    
                    <ul *ngIf="sugestoesVisiveisCriacao.length > 0 && novoGrupo.jogo.length > 0" class="absolute top-full left-0 w-full bg-slate-800 border border-slate-600 rounded mt-1 z-50 max-h-40 overflow-y-auto shadow-xl">
                        <li *ngFor="let sugestao of sugestoesVisiveisCriacao" 
                            (click)="selecionarSugestaoCriacao(sugestao)"
                            class="px-3 py-2 text-xs text-white hover:bg-violet-600 cursor-pointer border-b border-slate-700 last:border-0">
                            {{ sugestao }}
                        </li>
                    </ul>
                </div>

                <div>
                    <label class="block text-slate-400 text-xs mb-1">Data e Hora</label>
                    <input type="datetime-local" [(ngModel)]="novoGrupo.data" name="data" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white [color-scheme:dark]">
                </div>
                <div>
                    <label class="block text-slate-400 text-xs mb-1">Tipo</label>
                    <select [(ngModel)]="novoGrupo.tipo" name="tipo" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                        <option value="Online">Online</option>
                        <option value="Presencial">Presencial</option>
                    </select>
                </div>
                <div>
                    <label class="block text-slate-400 text-xs mb-1">Vagas Totais</label>
                    <input [(ngModel)]="novoGrupo.vagas" name="vagas" type="number" min="2" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white">
                </div>
                <div class="md:col-span-2">
                    <label class="block text-slate-400 text-xs mb-1">Descrição</label>
                    <textarea [(ngModel)]="novoGrupo.descricao" name="descricao" rows="2" class="w-full bg-slate-900 border border-slate-600 rounded p-2 text-white"></textarea>
                </div>
                <div class="md:col-span-2">
                    <button type="submit" [disabled]="loadingAction()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition-colors disabled:opacity-50">
                        {{ loadingAction() ? 'Criando...' : 'Publicar Evento' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- LISTA DE GRUPOS -->
        <div class="space-y-4">
            <div *ngIf="loading()" class="text-center text-slate-500 py-8">Carregando grupos...</div>

            <div *ngFor="let grupo of grupos()" 
                 [class.opacity-60]="isExpirado(grupo.data)"
                 class="bg-slate-800 rounded-lg p-4 border border-slate-700 flex flex-col md:flex-row md:items-center gap-4 hover:border-emerald-500/50 transition-colors relative">
                
                <div (click)="abrirDetalhes(grupo.id)" class="flex-grow flex gap-4 cursor-pointer">
                    <div class="w-16 h-16 bg-slate-900 rounded-lg flex flex-col items-center justify-center flex-shrink-0 text-slate-300 border border-slate-700 overflow-hidden">
                        <span class="text-xs uppercase font-bold text-slate-500">{{ grupo.data | date:'MMM' }}</span>
                        <span class="text-xl font-bold text-white">{{ grupo.data | date:'dd' }}</span>
                    </div>
                    
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <h3 class="font-bold text-lg text-white hover:text-violet-400 transition-colors">{{ grupo.titulo }}</h3>
                            <span [class]="grupo.tipo === 'Online' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'" class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border">
                                {{ grupo.tipo }}
                            </span>
                            <span *ngIf="isExpirado(grupo.data)" class="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold">
                                Encerrado
                            </span>
                        </div>
                        <p class="text-slate-400 text-sm mb-2 line-clamp-1">{{ grupo.descricao }}</p>
                        <div class="flex items-center gap-4 text-xs text-slate-500">
                            <span>🕒 {{ grupo.data | date:'shortTime' }}</span>
                            <span>🎮 {{ grupo.jogo }}</span>
                            <span class="text-violet-400 font-bold hover:underline">Ver Detalhes</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex flex-col items-end gap-2 min-w-[140px]">
                    <div class="text-right">
                        <span class="text-sm font-bold text-white">{{ getOcupados(grupo) }}/{{ grupo.vagas }}</span>
                        <span class="text-xs text-slate-500 ml-1">jogadores</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-1.5 mb-1">
                        <div class="bg-emerald-500 h-1.5 rounded-full" [style.width.%]="(getOcupados(grupo) / grupo.vagas) * 100"></div>
                    </div>

                    <ng-container *ngIf="auth.currentUser() as user; else loginMsg">
                        <button *ngIf="!jaParticipa(grupo, user.id) && getOcupados(grupo) < grupo.vagas" 
                                (click)="entrarNoGrupo(grupo.id)"
                                [disabled]="loadingAction() || isExpirado(grupo.data)"
                                [class.opacity-50]="isExpirado(grupo.data)"
                                [class.cursor-not-allowed]="isExpirado(grupo.data)"
                                class="w-full bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                            {{ isExpirado(grupo.data) ? 'Encerrado' : 'Entrar no Grupo' }}
                        </button>
                        <span *ngIf="jaParticipa(grupo, user.id)" class="text-emerald-400 text-xs font-bold py-1.5">✅ Já participa</span>
                        <span *ngIf="!jaParticipa(grupo, user.id) && getOcupados(grupo) >= grupo.vagas" class="text-red-400 text-xs font-bold py-1.5">🔒 Lotado</span>
                    </ng-container>
                    <ng-template #loginMsg><span class="text-slate-500 text-xs italic">Faça login</span></ng-template>
                </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!loading() && grupos().length === 0" class="text-center py-12 text-slate-500 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
                <p>Nenhum evento encontrado com estes filtros.</p>
                <button (click)="limparFiltrosAvancados()" class="text-violet-400 text-sm mt-2 hover:underline">Limpar filtros</button>
            </div>
        </div>
    </div>

    <!-- MODAL DETALHES (Mantido igual) -->
    <div *ngIf="selectedGroup()" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="selectedGroup.set(null)"></div>
        <div class="relative bg-slate-800 w-full max-w-lg rounded-xl border border-slate-600 shadow-2xl overflow-hidden animate-fadeIn">
            <div class="p-6 border-b border-slate-700 bg-slate-900/50 flex justify-between items-start">
                <div>
                    <h2 class="text-2xl font-bold text-white mb-1">{{ selectedGroup()?.titulo }}</h2>
                    <div class="flex gap-2">
                        <span class="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{{ selectedGroup()?.jogo }}</span>
                        <span class="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">{{ selectedGroup()?.tipo }}</span>
                        <span *ngIf="isExpirado(selectedGroup()!.data)" class="text-xs bg-red-900/50 text-red-200 border border-red-500/30 px-2 py-1 rounded">Encerrado</span>
                    </div>
                </div>
                <button (click)="selectedGroup.set(null)" class="text-slate-400 hover:text-white text-xl font-bold">✕</button>
            </div>
            <div class="p-6 max-h-[60vh] overflow-y-auto">
                <div class="mb-6">
                    <h3 class="text-slate-500 text-xs uppercase font-bold mb-2">Detalhes</h3>
                    <p class="text-slate-300">{{ selectedGroup()?.descricao }}</p>
                    <p class="text-violet-400 text-sm mt-2 font-bold flex items-center gap-2">
                        📅 {{ selectedGroup()?.data | date:'fullDate' }} às {{ selectedGroup()?.data | date:'shortTime' }}
                    </p>
                </div>
                <div>
                    <h3 class="text-slate-500 text-xs uppercase font-bold mb-3 flex justify-between">
                        Participantes <span class="text-white">{{ selectedGroup()?.membrosDetalhados?.length || 0 }} / {{ selectedGroup()?.vagas }}</span>
                    </h3>
                    <div class="space-y-2">
                        <div *ngFor="let membro of selectedGroup()?.membrosDetalhados" class="flex items-center gap-3 bg-slate-700/30 p-2 rounded">
                            <img [src]="membro.avatar || 'https://i.pravatar.cc/150'" class="w-8 h-8 rounded-full border border-slate-600">
                            <div><p class="text-white font-bold text-xs">{{ membro.nome }}</p><span class="text-[10px] text-slate-400 border border-slate-600 px-1 rounded">{{ membro.estilo }}</span></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-4 bg-slate-900 border-t border-slate-700 flex justify-end">
                <ng-container *ngIf="auth.currentUser() as user">
                     <button *ngIf="!jaParticipa(selectedGroup()!, user.id) && getOcupados(selectedGroup()!) < selectedGroup()!.vagas" (click)="entrarNoGrupo(selectedGroup()!.id); selectedGroup.set(null)" [disabled]="isExpirado(selectedGroup()!.data)" [class.opacity-50]="isExpirado(selectedGroup()!.data)" class="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-6 rounded transition-colors">{{ isExpirado(selectedGroup()!.data) ? 'Evento Encerrado' : 'Confirmar Presença' }}</button>
                    <button *ngIf="jaParticipa(selectedGroup()!, user.id)" disabled class="bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 font-bold py-2 px-6 rounded cursor-not-allowed">Você já está participando</button>
                </ng-container>
            </div>
        </div>
    </div>
  `
})
export class GroupsComponent implements OnInit {
  private groupService = inject(GroupService);
  auth = inject(AuthService);
  confirmation = inject(ConfirmationService);
  playerService = inject(PlayerService);

  grupos = signal<Grupo[]>([]);
  selectedGroup = signal<Grupo | null>(null);
  
  showForm = signal(false);
  showAdvancedFilters = signal(false);
  loading = signal(true);
  loadingAction = signal(false);

  filtroData: 'upcoming' | 'past' | 'all' = 'upcoming';
  filtrosAvancados = { nome: '', jogo: '', inicio: '', fim: '' };

  novoGrupo = { titulo: '', jogo: '', descricao: '', vagas: 5, tipo: 'Online' as const, data: '' };

  // --- AUTOCOMPLETE VARS ---
  todosJogos: string[] = [];
  // Arrays separados para Filtro e Criação
  sugestoesVisiveisCriacao: string[] = [];
  sugestoesVisiveisFiltro: string[] = [];
  // -------------------------

  ngOnInit() {
    this.carregarGrupos();
    // Carrega a lista de jogos do sistema para o autocomplete
    this.playerService.getListaJogos().subscribe(j => this.todosJogos = j);
  }

  // --- AUTOCOMPLETE LOGIC (Formulário Criação) ---
  filtrarSugestoesCriacao() {
      if (!this.novoGrupo.jogo) {
          this.sugestoesVisiveisCriacao = [];
          return;
      }
      const termo = this.novoGrupo.jogo.toLowerCase();
      this.sugestoesVisiveisCriacao = this.todosJogos.filter(j => j.toLowerCase().includes(termo));
  }

  selecionarSugestaoCriacao(jogo: string) {
      this.novoGrupo.jogo = jogo;
      this.sugestoesVisiveisCriacao = [];
  }

  // --- AUTOCOMPLETE LOGIC (Filtros Avançados) ---
  filtrarSugestoesFiltro() {
      if (!this.filtrosAvancados.jogo) {
          this.sugestoesVisiveisFiltro = [];
          return;
      }
      const termo = this.filtrosAvancados.jogo.toLowerCase();
      this.sugestoesVisiveisFiltro = this.todosJogos.filter(j => j.toLowerCase().includes(termo));
  }

  selecionarSugestaoFiltro(jogo: string) {
      this.filtrosAvancados.jogo = jogo;
      this.sugestoesVisiveisFiltro = [];
      this.aplicarFiltros(); // Opcional: já busca ao selecionar
  }
  // ----------------------------------------------

  carregarGrupos() {
    this.loading.set(true);
    this.groupService.getGrupos(this.filtroData, this.filtrosAvancados).subscribe({
      next: (dados) => { this.grupos.set(dados); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  onFiltroChange(novoFiltro: 'upcoming' | 'past' | 'all') {
      this.filtroData = novoFiltro;
      this.carregarGrupos();
  }

  toggleAdvancedFilters() { this.showAdvancedFilters.set(!this.showAdvancedFilters()); }
  aplicarFiltros() { this.carregarGrupos(); }
  limparFiltrosAvancados() { 
      this.filtrosAvancados = { nome: '', jogo: '', inicio: '', fim: '' }; 
      this.filtroData = 'all'; 
      this.carregarGrupos(); 
  }

  isExpirado(dataString: string | Date): boolean { return new Date(dataString) < new Date(); }
  abrirDetalhes(id: number) { this.groupService.getGrupoDetalhes(id).subscribe(g => this.selectedGroup.set(g)); }
  toggleForm() { this.showForm.set(!this.showForm()); }

  criarGrupo() {
    const user = this.auth.currentUser();
    if (!user) return;
    if (!this.novoGrupo.data) { alert('Por favor selecione uma data.'); return; }
    this.loadingAction.set(true);
    const grupoParaEnviar = { ...this.novoGrupo, donoId: user.id };
    this.groupService.criarGrupo(grupoParaEnviar).subscribe({
      next: (novo) => {
        if (this.filtroData !== 'past') { this.grupos.update(lista => [novo, ...lista]); }
        this.showForm.set(false);
        this.loadingAction.set(false);
        this.novoGrupo = { titulo: '', jogo: '', descricao: '', vagas: 5, tipo: 'Online', data: '' };
      },
      error: () => { alert('Erro ao criar'); this.loadingAction.set(false); }
    });
  }

  async entrarNoGrupo(groupId: number) {
    const user = this.auth.currentUser();
    if (!user) return;
    const confirmou = await this.confirmation.confirm({ title: 'Entrar no Esquadrão', message: 'Tem a certeza que deseja participar?', confirmText: 'Confirmar Entrada', type: 'info' });
    if (!confirmou) return;
    this.loadingAction.set(true);
    this.groupService.entrarNoGrupo(groupId, user.id).subscribe({
      next: (grupoAtualizado) => {
        this.grupos.update(lista => lista.map(g => g.id === groupId ? grupoAtualizado : g));
        this.loadingAction.set(false);
      },
      error: (err) => { alert(err.error?.message || 'Erro'); this.loadingAction.set(false); }
    });
  }

  getOcupados(grupo: Grupo): number { return grupo.membrosIds ? grupo.membrosIds.length : 0; }
  jaParticipa(grupo: Grupo, userId: number): boolean { if (!grupo.membrosIds) return false; return grupo.membrosIds.includes(userId.toString()); }
}