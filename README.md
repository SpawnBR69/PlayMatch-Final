# **PlayMatch: Conectando Gamers**

O **PlayMatch** é uma plataforma digital desenvolvida para conectar jogadores de jogos virtuais e presenciais. O objetivo é facilitar a busca por parceiros e equipes compatíveis, diminuindo a toxicidade e melhorando a experiência social dos games.

## **🚀 Tecnologias Utilizadas**

**Frontend (Client-side):**

* **Angular (v17+):** Framework principal.  
* **Tailwind CSS:** Estilização responsiva e moderna.  
* **TypeScript:** Linguagem base.

**Backend (Server-side):**

* **NestJS:** Framework para construção de APIs escaláveis.  
* **TypeORM:** ORM para manipulação do banco de dados.  
* **PostgreSQL:** Banco de dados relacional.

**Outros:**

* **Render:** Plataforma de hospedagem (Deploy).

## **🛠️ Instruções de Instalação (Rodar Localmente)**

Siga os passos abaixo para configurar o ambiente de desenvolvimento.

### **Pré-requisitos**

* Node.js (v18 ou superior)  
* PostgreSQL instalado e rodando (ou acesso a um banco remoto)

### **1\. Configurando o Backend**

1. Acesse a pasta do servidor:  
   cd backend

2. Instale as dependências:  
   npm install

3. Configure o Banco de Dados:  
   * Abra o arquivo src/app.module.ts e verifique as credenciais do banco de dados (host, user, password).  
   * Para ambiente local, certifique-se de que o Postgres está rodando na porta 5432\.  
4. Inicie o servidor:  
   npm run start:dev

   * O backend rodará em: http://localhost:3000

### **2\. Configurando o Frontend**

1. Abra um novo terminal e acesse a pasta do cliente:  
   cd frontend

2. Instale as dependências:  
   npm install

3. Inicie a aplicação:  
   npm start

4. Acesse no navegador: http://localhost:4200

## **📖 Instruções de Uso**

1. **Matchmaking:**  
   * Acesse a página inicial para ver a lista de jogadores.  
   * Utilize os filtros (Jogo, Estilo, Nome) para encontrar parceiros ideais.  
   * Clique em um card de jogador para ver detalhes e avaliações.  
2. **Interação:**  
   * Clique em **"Convidar / Chat"** para iniciar uma conversa.  
   * É necessário criar uma conta ou fazer login para interagir.  
3. **Esquadrões (Eventos):**  
   * Vá até a aba "Esquadrões" para ver eventos criados pela comunidade.  
   * Utilize o botão "+ Criar" para agendar sua própria jogatina.  
4. **Perfil:**  
   * No menu "Perfil", você pode editar seus jogos favoritos, biografia e gerenciar usuários bloqueados.

## **📂 Estrutura do Repositório**

* /frontend: Código fonte da aplicação Angular.  
* /backend: API RESTful construída com NestJS.  
* /database: Scripts SQL para popular o banco de dados inicial.