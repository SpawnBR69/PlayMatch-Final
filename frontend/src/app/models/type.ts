export interface Jogo {
  id: number;
  nome: string;
  tipo: 'FPS' | 'MOBA' | 'RPG' | 'Tabuleiro' | 'Cartas';
  imagem: string;
}

export interface Jogador {
  id: number;
  nome: string;
  avatar: string;
  bio: string;
  reputacao: number;
  estilo: 'Casual' | 'Competitivo' | 'For Fun';
  plataformas: string[];
  jogosFavoritos: string[];
  disponibilidade: string;
  localizacao?: string;
}

export interface Grupo {
  id: number;
  titulo: string;
  jogo: string;
  descricao: string;
  vagas: number;
  vagasOcupadas: number;
  tipo: 'Online' | 'Presencial';
  data: string;
}

export interface Grupo {
  id: number;
  titulo: string;
  jogo: string;
  descricao: string;
  vagas: number;
  membrosIds: string[];
  donoId: number;
  tipo: 'Online' | 'Presencial';
  data: string;
  membrosDetalhados?: Jogador[]; 
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

export interface Review {
  id: number;
  authorId: number;
  authorName: string;
  targetId: number;
  rating: number;
  comment: string;
  createdAt: string;
}