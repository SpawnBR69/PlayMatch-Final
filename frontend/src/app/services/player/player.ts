import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jogador, Review } from '../../models/type';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private http = inject(HttpClient);
  
  // URL Base da API (sem /players)
  private readonly baseUrl = 'https://backend-playmatch-n9yw.onrender.com/api';

  // --- ROTAS DE JOGADORES ---
  getJogadores(): Observable<Jogador[]> {
    return this.http.get<Jogador[]>(`${this.baseUrl}/players`);
  }

  getListaJogos(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/players/lists/games`);
  }

  filtrarJogadores(jogo?: string, estilo?: string, nome?: string): Observable<Jogador[]> {
    let params: any = {};
    if (jogo) params.jogo = jogo;
    if (estilo) params.estilo = estilo;
    if (nome) params.nome = nome;

    return this.http.get<Jogador[]>(`${this.baseUrl}/players`, { params });
  }
  
  getReviews(targetId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews`, { 
      params: { targetId: targetId.toString() } 
    });
  }

  addReview(review: any): Observable<Review> {
    return this.http.post<Review>(`${this.baseUrl}/reviews`, review);
  }
}