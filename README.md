# QIK Delivery - Restaurant Backend

<div align="center">

![QIK Delivery Logo](https://your-logo-url.com/logo.png)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat&logo=jest&logoColor=white)](https://jestjs.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)

</div>

## 📋 Índice

- [Sobre](#-sobre)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação](#-instalação)
- [Endpoints](#-endpoints)
- [Testes](#-testes)
- [Deploy](#-deploy)

## 🚀 Sobre

Backend do sistema QIK Delivery, desenvolvido com NestJS para fornecer uma API robusta e escalável para o gerenciamento de restaurantes, cardápios e pedidos. O sistema utiliza PostgreSQL como banco de dados e Prisma como ORM, garantindo tipo seguro e eficiência nas operações com o banco de dados.

## 🛠 Tecnologias

### Core
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript tipado
- **[Prisma](https://www.prisma.io/)** - ORM moderno
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação e autorização
- **[Swagger](https://swagger.io/)** - Documentação da API

### Segurança
- **[Argon2](https://github.com/ranisalt/node-argon2)** - Hash de senhas
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de dados
- **[class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos

### Testes
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes de API

## 🏗 Arquitetura

O projeto segue uma arquitetura modular com os seguintes módulos principais:

### Módulos
- **Auth**: Autenticação e autorização
- **Restaurant**: Gestão de restaurantes
- **Menu**: Gestão de cardápios
- **Order**: Gestão de pedidos
- **Address**: Gestão de endereços

### Estrutura de Diretórios
\`\`\`
src/
├── controllers/     # Controladores da API
├── services/       # Lógica de negócios
├── dto/            # Objetos de transferência de dados
├── prisma/         # Configuração e cliente Prisma
├── filters/        # Filtros de exceção
└── types/          # Tipos TypeScript
\`\`\`

## 🚀 Instalação

1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/restaurant-backend.git
cd restaurant-backend
\`\`\`

2. Instale as dependências
\`\`\`bash
npm install
# ou
pnpm install
\`\`\`

3. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure o banco de dados
\`\`\`bash
npx prisma migrate dev
\`\`\`

5. Inicie o servidor
\`\`\`bash
npm run start:dev
# ou
pnpm run start:dev
\`\`\`

## 🔌 Endpoints

### Auth
- **POST** `/auth/login` - Autenticação de restaurante

### Restaurants
- **POST** `/restaurants` - Criar restaurante
- **GET** `/restaurants` - Listar restaurantes
- **GET** `/restaurants/:id` - Obter restaurante
- **PUT** `/restaurants/:id` - Atualizar restaurante
- **GET** `/restaurants/profile` - Perfil do restaurante
- **GET** `/restaurants/:id/menus` - Menus do restaurante

### Menus
- **POST** `/menus` - Criar menu
- **GET** `/menus` - Listar menus
- **PUT** `/menus/:id` - Atualizar menu

### Orders
- **POST** `/orders` - Criar pedido
- **GET** `/orders` - Listar pedidos
- **PUT** `/orders/:id` - Atualizar pedido

### Addresses
- **POST** `/addresses` - Criar endereço
- **GET** `/addresses` - Listar endereços
- **PUT** `/addresses/:id` - Atualizar endereço

## 🧪 Testes

### Unitários
\`\`\`bash
npm run test
# ou
pnpm run test
\`\`\`

### E2E
\`\`\`bash
npm run test:e2e
# ou
pnpm run test:e2e
\`\`\`

### Cobertura
\`\`\`bash
npm run test:cov
# ou
pnpm run test:cov
\`\`\`

## 🚀 Deploy

### Produção
\`\`\`bash
npm run build
npm run start:prod
# ou
pnpm run build
pnpm run start:prod
\`\`\`

### Scripts Disponíveis
\`\`\`json
{
  "build": "nest build",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:cov": "jest --coverage",
  "test:e2e": "jest --config ./test/jest-e2e.json"
}
\`\`\`

## 📝 Variáveis de Ambiente

\`\`\`env
# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# JWT
JWT_SECRET="seu-secret-jwt"

# Servidor
PORT=3000
NODE_ENV=development
\`\`\`

## 🔒 Segurança

- Autenticação via JWT
- Hash de senhas com Argon2
- Validação de dados com class-validator
- Guards para proteção de rotas
- Filtros de exceção globais

## 📚 Documentação

A documentação da API está disponível em `/api-docs` utilizando Swagger UI.

---

<div align="center">

**Desenvolvido com ❤️ por Igor Brandão**

</div> 
