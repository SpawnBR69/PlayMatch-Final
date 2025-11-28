import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // IMPORTANTE: Permite que seu Frontend no Vercel/Render acesse este Backend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  
  // MUDANÇA CRÍTICA: Usa a porta do ambiente (Render) ou 3000 se for local
  await app.listen(process.env.PORT || 3000); 
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
