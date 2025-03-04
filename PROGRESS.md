# Progresso do Backend do Sistema de Delivery

## Módulos Propostos

1. **Restaurant Module**
   - **Responsabilidades**:
     - Gerenciar as operações relacionadas aos restaurantes, como cadastro, atualização e listagem.
     - Implementar a lógica de autenticação para os restaurantes (login).
   - **Estrutura**:
     - **Controller**: Para gerenciar as rotas relacionadas a restaurantes (ex: `POST /restaurants`, `GET /restaurants`).
     - **Service**: Para a lógica de negócios, como manipulação de dados e interações com o banco de dados.
     - **DTOs**: Para definir a estrutura dos dados que serão enviados e recebidos nas requisições.

2. **Menu Module**
   - **Responsabilidades**:
     - Gerenciar os itens do cardápio, incluindo adição, edição e remoção de itens.
     - Listar os itens do cardápio por restaurante.
   - **Estrutura**:
     - **Controller**: Para gerenciar as rotas relacionadas ao menu (ex: `GET /menu`, `POST /menu`).
     - **Service**: Para a lógica de negócios relacionada ao menu.
     - **DTOs**: Para definir a estrutura dos dados do menu, como itens e seções.

3. **Order Module**
   - **Responsabilidades**:
     - Gerenciar os pedidos feitos pelos clientes, incluindo criação e listagem de pedidos.
   - **Estrutura**:
     - **Controller**: Para gerenciar as rotas de pedidos (ex: `POST /orders`).
     - **Service**: Para a lógica de negócios relacionada aos pedidos.

4. **Address Module**
   - **Responsabilidades**:
     - Gerenciar os endereços de entrega dos clientes.
   - **Estrutura**:
     - **Controller**: Para gerenciar as rotas de endereços (ex: `POST /addresses`, `GET /addresses`).
     - **Service**: Para a lógica de negócios relacionada aos endereços.

5. **Auth Module**
   - **Responsabilidades**:
     - Gerenciar a autenticação dos restaurantes, incluindo login e geração de tokens JWT.
   - **Estrutura**:
     - **Controller**: Para gerenciar as rotas de autenticação (ex: `POST /auth/login`).
     - **Service**: Para a lógica de autenticação e geração de tokens.

## Considerações Técnicas
- **Banco de Dados**: Utilizar PostgreSQL para armazenar as informações de restaurantes, menus e pedidos.
- **ORM**: Utilizar Prisma como ORM para facilitar a interação com o banco de dados.
- **Validação**: Implementar validação de entrada nos DTOs para garantir que os dados recebidos estejam corretos.
- **Tratamento de Erros**: Implementar um mecanismo centralizado para capturar e gerenciar erros.

## Restaurant Module Reimplementation in NestJS
- Recreated the `src` directory structure for the NestJS application.
- Implemented `RestaurantController` to manage routes for restaurant operations.
- Implemented `RestaurantService` to handle business logic for restaurant operations.
- Defined `RestaurantDto` to structure data for requests and responses.
- Set up `AppModule` to include the Restaurant module and its components.
- Configured `main.ts` as the entry point for the NestJS application.

## Menu Module Implementation in NestJS
- Created `menu.controller.ts` to manage routes for menu operations.
- Implemented `MenuService` to handle business logic for menu operations.
- Defined `MenuDto` to structure data for requests and responses.
- Updated `AppModule` to include the Menu module and its components.

## Order Module Implementation in NestJS
- Created `order.controller.ts` to manage routes for order operations.
- Implemented `OrderService` to handle business logic for order operations.
- Defined `OrderDto` to structure data for requests and responses.
- Updated `AppModule` to include the Order module and its components.

## Address Module Implementation in NestJS
- Created `address.controller.ts` to manage routes for address operations.
- Implemented `AddressService` to handle business logic for address operations.
- Defined `AddressDto` to structure data for requests and responses.
- Updated `AppModule` to include the Address module and its components.

## Auth Module Implementation in NestJS
- Created `auth.controller.ts` to manage routes for authentication operations.
- Implemented `AuthService` to handle authentication logic and token generation.
- Defined `AuthDto` to structure data for requests and responses.
- Updated `AppModule` to include the Auth module and its components.

## Validation Implementation in NestJS
- Installed `class-validator` and `class-transformer` for data validation.
- Updated `RestaurantDto` to include validation rules.
- Updated `MenuDto` to include validation rules.
- Updated `OrderDto` to include validation rules.
- Updated `AddressDto` to include validation rules.
- Updated `AuthDto` to include validation rules.
- Enabled global validation in the main application entry point.

## Error Handling Implementation in NestJS
- Created a global exception filter to handle errors consistently across the application.
- Registered the exception filter in the main application entry point. 