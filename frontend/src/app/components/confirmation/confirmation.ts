import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation/confirmation';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Container Principal (Só aparece se isOpen for true) -->
    <div *ngIf="service.isOpen()" class="fixed inset-0 z-[10000] flex items-center justify-center px-4">
      
      <!-- Backdrop Escuro (Fundo borrado) -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" (click)="service.resolve(false)"></div>

      <!-- O Modal em si -->
      <div class="relative bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scaleIn">
        
        <!-- Ícone e Título -->
        <div class="text-center mb-4">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4"
               [ngClass]="service.options().type === 'danger' ? 'bg-red-500/20 text-red-400' : 'bg-violet-500/20 text-violet-400'">
            <span class="text-2xl font-bold">
                {{ service.options().type === 'danger' ? '!' : '?' }}
            </span>
          </div>
          <h3 class="text-xl font-bold text-white leading-6">
            {{ service.options().title }}
          </h3>
        </div>

        <!-- Mensagem -->
        <div class="mt-2 text-center">
          <p class="text-sm text-slate-300">
            {{ service.options().message }}
          </p>
        </div>

        <!-- Botões -->
        <div class="mt-6 flex justify-center gap-3">
          <button (click)="service.resolve(false)" 
                  class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors w-full">
            {{ service.options().cancelText }}
          </button>
          
          <button (click)="service.resolve(true)"
                  [ngClass]="service.options().type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-violet-600 hover:bg-violet-700'"
                  class="px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors w-full shadow-lg shadow-black/30">
            {{ service.options().confirmText }}
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scaleIn {
      animation: scaleIn 0.2s ease-out forwards;
    }
  `]
})
export class ConfirmationModalComponent {
  service = inject(ConfirmationService);
}