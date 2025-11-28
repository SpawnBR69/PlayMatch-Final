import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  // Exibe uma notificação de sucesso (Verde)
  success(message: string) {
    this.add(message, 'success');
  }

  // Exibe uma notificação de erro (Vermelho)
  error(message: string) {
    this.add(message, 'error');
  }

  // Exibe uma notificação informativa (Azul/Violeta)
  info(message: string) {
    this.add(message, 'info');
  }

  // Exibe um aviso (Amarelo/Laranja)
  warning(message: string) {
    this.add(message, 'warning');
  }

  // Lógica interna para adicionar e remover automaticamente
  private add(message: string, type: Toast['type']) {
    const id = Date.now(); // ID único baseado no tempo
    const newToast: Toast = { id, message, type };
    
    // Adiciona ao topo da lista
    this.toasts.update(current => [newToast, ...current]);

    // Remove automaticamente após 3 segundos (3000ms)
    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}