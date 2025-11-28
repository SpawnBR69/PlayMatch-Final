import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info'; // Para mudar a cor do botão (Vermelho ou Roxo)
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  // Estado do Modal
  isOpen = signal(false);
  options = signal<ConfirmationOptions>({ title: '', message: '' });
  
  // Guarda a função que vai resolver a Promessa (Sim ou Não)
  private resolveRef: ((result: boolean) => void) | null = null;

  // O componente chama este método
  confirm(opts: ConfirmationOptions): Promise<boolean> {
    this.options.set({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'info',
      ...opts
    });
    this.isOpen.set(true);

    // Retorna uma promessa que será resolvida quando o usuário clicar nos botões
    return new Promise<boolean>((resolve) => {
      this.resolveRef = resolve;
    });
  }

  // Chamado pelos botões do Modal
  resolve(result: boolean) {
    this.isOpen.set(false);
    if (this.resolveRef) {
      this.resolveRef(result);
      this.resolveRef = null;
    }
  }
}