import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './player/player.module';
import { ChatModule } from './chat/chat.module'; // Seus outros módulos...
import { GroupsModule } from './groups/groups.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Se existir a variável DATABASE_URL (Produção), usa ela.
      // Se não, usa as configurações locais.
      url: process.env.DATABASE_URL, 
      
      // Fallback para localhost (caso não tenha DATABASE_URL)
      host: process.env.DATABASE_URL ? undefined : 'localhost',
      port: process.env.DATABASE_URL ? undefined : 5432,
      username: process.env.DATABASE_URL ? undefined : 'postgres',
      password: process.env.DATABASE_URL ? undefined : '123', // Sua senha local
      database: process.env.DATABASE_URL ? undefined : 'playmatch_db',
      
      autoLoadEntities: true,
      synchronize: true, // Em produção real seria false, mas para demo deixe true
      
      // CRÍTICO PARA RENDER.COM: SSL é obrigatório
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
    }),
    PlayersModule,
    ChatModule,
    GroupsModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}