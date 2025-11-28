import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat/chat';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-2 cursor-pointer" (click)="onNavClick('home')">
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">PlayMatch</span>
          </div>
          
          <div class="flex items-center gap-4">
             <!-- Menu Desktop -->
             <div class="hidden md:flex items-baseline space-x-4">
                <button (click)="onNavClick('home')" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Matchmaking</button>
                <button (click)="onNavClick('groups')" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Esquadrões</button>
                <button (click)="onNavClick('profile')" class="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Perfil</button>
             </div>

             <!-- BOTÃO CHAT -->
             <button (click)="chatService.toggleSidebar()" class="relative p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="Abrir Chat">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <!-- Bolinha de status (verde se aberto) -->
                <span *ngIf="chatService.isSidebarOpen()" class="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-800"></span>
             </button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  @Input() currentView: string = 'home';
  @Output() viewChange = new EventEmitter<string>();
  
  chatService = inject(ChatService); // Injeção

  onNavClick(view: string) {
    this.viewChange.emit(view);
  }
}