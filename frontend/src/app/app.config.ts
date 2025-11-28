import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita o cliente HTTP (essencial para conversar com o NestJS)
    // withFetch é uma otimização moderna para navegadores
    provideHttpClient(withFetch())
  ]
};