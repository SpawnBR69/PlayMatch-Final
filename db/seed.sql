-- Inserção de 10 Jogadores Variados para o PlayMatch

INSERT INTO player 
("nome", "email", "senha", "avatar", "bio", "reputacao", "estilo", "plataformas", "jogosFavoritos", "disponibilidade", "localizacao") 
VALUES 

-- 1. O Competitivo de FPS
('Lucas "Sniper" Mendes', 'lucas.fps@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=lucas', 
 'Foco total em subir de elo no Valorant e CS2. Jogo sério, comunicação limpa. Busco time fechado.', 
 4.8, 'Competitivo', 'PC', 'Valorant,CS2,Apex Legends', 'Noite (20h - 00h)', 'São Paulo, SP'),

-- 2. A Mestre de RPG
('Marina "DungeonMaster"', 'marina.rpg@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=marina', 
 'Narradora de D&D 5e e Vampiro a Máscara. Mesa presencial focada em interpretação e roleplay.', 
 5.0, 'For Fun', 'Mesa,PC', 'Dungeons & Dragons,Baldur''s Gate 3', 'Finais de Semana', 'Montes Claros, MG'),

-- 3. O Jogador Casual de Console
('João "Fifeiro" Souza', 'joao.console@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=joao', 
 'Só jogo pra relaxar depois do trabalho. Um FIFAzinho ou CoD sem compromisso.', 
 4.2, 'Casual', 'PlayStation 5,Xbox', 'FIFA 24,Call of Duty,GTA V', 'Noite e Fds', 'Rio de Janeiro, RJ'),

-- 4. A Main Suporte (MOBA)
('Beatriz "Healer" Lima', 'bia.lol@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=beatriz', 
 'Main Lulu e Nami. Busco ADC agressivo para duo queue. Diamante 3+.', 
 4.9, 'Competitivo', 'PC', 'League of Legends,Teamfight Tactics', 'Tarde e Noite', 'Curitiba, PR'),

-- 5. O Entusiasta de Board Games
('Ricardo "Meeple" Alves', 'ricardo.board@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=ricardo', 
 'Colecionador de Eurogames. Organizo jogatinas de Catan, Ticket to Ride e Terraforming Mars.', 
 5.0, 'For Fun', 'Mesa', 'Catan,Ticket to Ride,Carcassonne', 'Sábados à tarde', 'Belo Horizonte, MG'),

-- 6. A Streamer de Variedade
('Sofia "Cozy" Games', 'sofia.cozy@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=sofia', 
 'Gosto de jogos de fazendinha e sobrevivência coop. Stardew Valley e Minecraft.', 
 4.7, 'Casual', 'PC,Switch', 'Stardew Valley,Minecraft,Animal Crossing', 'Manhãs', 'Florianópolis, SC'),

-- 7. O Estrategista (RTS)
('Pedro "Commander" Rocha', 'pedro.rts@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=pedro', 
 'Fã de Age of Empires e Starcraft. Procuro gente para x1 ou x2 sem rage.', 
 4.5, 'Competitivo', 'PC', 'Age of Empires IV,Starcraft 2', 'Madrugada', 'Online'),

-- 8. A Retrogamer
('Fernanda "8Bit" Costa', 'fe.retro@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=fernanda', 
 'Amo clássicos de SNES e Mega Drive. Speedrunner de Mario World.', 
 4.6, 'Casual', 'PC,Emuladores', 'Super Mario World,Zelda,Metroid', 'Variável', 'Porto Alegre, RS'),

-- 9. O Tank (Overwatch)
('Gabriel "Shield" Santos', 'gabriel.ow@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=gabriel', 
 'Reinhardt main. Preciso de healers que não me deixem morrer. Rumo ao Grandmaster.', 
 3.9, 'Competitivo', 'PC', 'Overwatch 2,Paladins', 'Noite (19h - 22h)', 'Salvador, BA'),

-- 10. A Jogadora de Cartas (TCG)
('Larissa "DeckMaster"', 'lari.tcg@email.com', 'senha123', 
 'https://i.pravatar.cc/150?u=larissa', 
 'Magic: The Gathering (Commander) e Hearthstone. Gosto de decks de controle.', 
 4.8, 'For Fun', 'Mesa,PC,Mobile', 'Magic: The Gathering,Hearthstone,Marvel Snap', 'Domingos', 'Brasília, DF');