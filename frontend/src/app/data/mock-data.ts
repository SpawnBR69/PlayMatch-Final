import { Jogo, Jogador, Grupo } from '../models/type';

export const MOCK_JOGOS: Jogo[] = [
  { id: 1, nome: 'League of Legends', tipo: 'MOBA', imagem: '' },
  { id: 2, nome: 'Valorant', tipo: 'FPS', imagem: '' },
  { id: 3, nome: 'Dungeons & Dragons', tipo: 'RPG', imagem: '' },
  { id: 4, nome: 'Catan', tipo: 'Tabuleiro', imagem: '' },
];

export const MOCK_JOGADORES: Jogador[] = [
  {
    id: 1, nome: 'Ana "Healer" Silva', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    bio: 'Main suporte, procuro time para Clash e Rankeds. Jogo sério mas sem toxicidade.',
    reputacao: 4.8, estilo: 'Competitivo', plataformas: ['PC'],
    jogosFavoritos: ['League of Legends', 'Overwatch 2'], disponibilidade: 'Noite (19h - 23h)'
  },
  {
    id: 2, nome: 'Carlos "Dice" Oliveira', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    bio: 'Mestre de RPG procurando jogadores para mesa presencial de D&D 5e.',
    reputacao: 5.0, estilo: 'For Fun', plataformas: ['Mesa'],
    jogosFavoritos: ['Dungeons & Dragons', 'Catan'], disponibilidade: 'Finais de semana', localizacao: 'Montes Claros, MG'
  },
  {
    id: 3, nome: 'Lucas "Rush" Pereira', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
    bio: 'Jogo CS e Valorant. Busco duo para subir elo.',
    reputacao: 3.5, estilo: 'Competitivo', plataformas: ['PC', 'Xbox'],
    jogosFavoritos: ['Valorant', 'CS2'], disponibilidade: 'Tarde'
  },
  {
    id: 4, nome: 'Mariana Games', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026024d',
    bio: 'Só quero me divertir e dar risada. Zero stress.',
    reputacao: 4.9, estilo: 'Casual', plataformas: ['PlayStation 5'],
    jogosFavoritos: ['Fortnite', 'Minecraft'], disponibilidade: 'Variável'
  }
];

export const MOCK_GRUPOS: Grupo[] = [];