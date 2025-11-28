import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-20 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      
      <!-- Loop sobre as notificações -->
      <div *ngFor="let toast of toastService.toasts()" 
           class="pointer-events-auto transform transition-all duration-300 animate-slideIn flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border-l-4 min-w-[300px] max-w-md bg-slate-800 text-white"
           [ngClass]="getBorderClass(toast.type)">
        
        <!-- Ícone baseado no tipo -->
        <span class="text-xl">
            {{ getIcon(toast.type) }}
        </span>

        <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
        </div>

        <!-- Botão fechar -->
        <button (click)="toastService.remove(toast.id)" class="text-slate-400 hover:text-white">
            ✕
        </button>
      </div>

    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
    .animate-slideIn {
      animation: slideIn 0.3s ease-out forwards;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);

  getBorderClass(type: string): string {
    switch (type) {
      case 'success': return 'border-emerald-500';
      case 'error': return 'border-red-500';
      case 'warning': return 'border-orange-500';
      default: return 'border-violet-500';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  }
}