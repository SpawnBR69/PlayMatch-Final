import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from '../../models/type'; // Certifique-se que a interface Grupo está atualizada no types.ts

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = 'https://backend-playmatch-n9yw.onrender.com/api/groups';

  getGrupos(
    status: 'upcoming' | 'past' | 'all' = 'upcoming',
    filtros: { nome?: string; jogo?: string; inicio?: string; fim?: string } = {}
  ): Observable<Grupo[]> {
    
    // Monta os parâmetros, ignorando os vazios
    let params: any = { status };
    if (filtros.nome) params.nome = filtros.nome;
    if (filtros.jogo) params.jogo = filtros.jogo;
    if (filtros.inicio) params.inicio = filtros.inicio;
    if (filtros.fim) params.fim = filtros.fim;

    return this.http.get<Grupo[]>(`${this.apiUrl}`, { params });
  }

  criarGrupo(grupo: any): Observable<Grupo> {
    return this.http.post<Grupo>(this.apiUrl, grupo);
  }

  getGrupoDetalhes(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.apiUrl}/${id}`);
  }

  entrarNoGrupo(groupId: number, playerId: number): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.apiUrl}/${groupId}/join`, { playerId });
  }
}