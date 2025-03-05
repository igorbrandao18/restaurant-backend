# QIK Delivery - Restaurant Dashboard

## Descrição

O QIK Delivery Restaurant Dashboard é uma aplicação web moderna desenvolvida para gerenciar restaurantes no sistema de delivery QIK. Esta interface permite que proprietários de restaurantes gerenciem seus menus, pedidos e configurações de forma eficiente e intuitiva.

## Funcionalidades Principais

### 1. Autenticação e Perfil
- Login seguro para restaurantes
- Gerenciamento de perfil do restaurante
- Configurações personalizadas da conta

### 2. Gestão de Cardápio
- Criação e edição de itens do menu
- Organização por categorias
- Upload de imagens dos produtos
- Gestão de preços e disponibilidade

### 3. Gestão de Pedidos
- Visualização em tempo real de novos pedidos
- Sistema de status de pedidos (Novo, Em Preparo, Pronto para Entrega, Entregue)
- Histórico completo de pedidos
- Detalhes do cliente e endereço de entrega

### 4. Dashboard e Relatórios
- Visão geral das vendas
- Métricas de desempenho
- Relatórios personalizados
- Análise de produtos mais vendidos

## Tecnologias Utilizadas

- React.js
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Socket.io-client (para atualizações em tempo real)

## Requisitos do Sistema

- Node.js 18.x ou superior
- npm ou yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)

## Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/seu-usuario/qik-delivery-frontend.git
cd qik-delivery-frontend
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`
Edite o arquivo .env com suas configurações

4. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

## Scripts Disponíveis

- \`npm run dev\`: Inicia o servidor de desenvolvimento
- \`npm run build\`: Cria a build de produção
- \`npm run lint\`: Executa o linter
- \`npm run test\`: Executa os testes
- \`npm run preview\`: Visualiza a build de produção localmente

## Estrutura do Projeto

\`\`\`
src/
├── assets/         # Imagens, fontes e outros recursos estáticos
├── components/     # Componentes React reutilizáveis
├── contexts/      # Contextos React
├── hooks/         # Hooks personalizados
├── layouts/       # Layouts da aplicação
├── pages/         # Componentes de página
├── services/      # Serviços e integrações com API
├── store/         # Configuração e slices do Redux
├── styles/        # Estilos globais e temas
├── types/         # Definições de tipos TypeScript
└── utils/         # Funções utilitárias
\`\`\`

## Integração com Backend

A aplicação se comunica com o backend através de uma API REST. Os endpoints principais são:

- Autenticação: \`/auth/login\`
- Restaurantes: \`/restaurants\`
- Menus: \`/menus\`
- Pedidos: \`/orders\`
- Endereços: \`/addresses\`

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit suas mudanças (\`git commit -m 'Add some AmazingFeature'\`)
4. Push para a branch (\`git push origin feature/AmazingFeature\`)
5. Abra um Pull Request

## Suporte

Para suporte, envie um email para support@qikdelivery.com ou abra uma issue no repositório.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para mais detalhes. 