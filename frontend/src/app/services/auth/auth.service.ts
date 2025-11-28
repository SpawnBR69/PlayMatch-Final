import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Jogador } from '../../models/type'; // Certifique-se de adicionar email/senha na interface Jogador também se precisar

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'https://backend-playmatch-n9yw.onrender.com/api/players';

  // Signal que guarda o usuário logado. 
  // Se for null, ninguém está logado.
  currentUser = signal<Jogador | null>(this.getUserFromStorage());

  // LOGIN
  login(email: string, senha: string): Observable<Jogador> {
    return this.http.post<Jogador>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap(user => {
        // Se deu certo, atualiza o sinal e salva no navegador
        this.currentUser.set(user);
        localStorage.setItem('playmatch_user', JSON.stringify(user));
      })
    );
  }

  // CADASTRO
  register(dados: any): Observable<Jogador> {
    return this.http.post<Jogador>(this.apiUrl, dados).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('playmatch_user', JSON.stringify(user));
      })
    );
  }

  updateProfile(id: number, dados: Partial<Jogador>): Observable<Jogador> {
    return this.http.patch<Jogador>(`${this.apiUrl}/${id}`, dados).pipe(
      tap(user => this.updateLocalUser(user))
    );
  }

  // LOGOUT
  logout() {
    // 1. Limpa o estado local
    this.currentUser.set(null);
    
    // 2. Remove do armazenamento persistente
    localStorage.removeItem('playmatch_user');
    
    // 3. Força o recarregamento da página
    // Isso garante que ChatService, GroupService e qualquer outro
    // estado na memória RAM sejam completamente zerados.
    window.location.reload();
  }

  private updateLocalUser(user: Jogador) {
    this.currentUser.set(user);
    localStorage.setItem('playmatch_user', JSON.stringify(user));
  }

  // Recupera o usuário se der F5 na página
  private getUserFromStorage(): Jogador | null {
    const stored = localStorage.getItem('playmatch_user');
    return stored ? JSON.parse(stored) : null;
  }
}