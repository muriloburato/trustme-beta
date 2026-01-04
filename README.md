# TrustMe - Plataforma de Verificação de Autenticidade

Esqueleto do Projeto TrustMe - em fase de testes, avaliacoes & implementacoes.

##  Arquitetura do Sistema

O TrustMe é composto por três repos principais:

### 1. **Backend API** (`/backend`)
- **Tecnologia**: Node.js + Express.js
- **Banco de Dados**: SQLite (local) com Sequelize ORM
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Arquivos**: Multer para processamento de imagens
- **Porta**: 3001

### 2. **Painel Web Administrativo** (`/web`)
- **Tecnologia**: React + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Funcionalidades**: 
  - Login para especialistas
  - Painel de avaliação de itens
  - Página pública de itens avaliados
- **Porta**: 5173

### 3. **Aplicativo Mobile** (`/mobile`)
- **Tecnologia**: React Native + Expo
- **Funcionalidades**:
  - Cadastro e login de usuários
  - Upload de fotos de tênis
  - Acompanhamento de avaliações

## Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm
- Expo CLI (para o app mobile)

### 1. Backend

```bash
cd backend
npm install
npm start
```

O servidor estará rodando em `http://localhost:3001`

### 2. Painel Web

```bash
cd web
pnpm install
pnpm run dev
```

O painel estará disponível em `http://localhost:5173`

### 3. App Mobile

```bash
cd mobile
npm install
npm run web  # Para testar no navegador
# ou
npm run android  # Para Android
npm run ios      # Para iOS (apenas no macOS)
```

##  Funcionalidades

### Para Usuários (App Mobile)
- ✅ Cadastro e autenticação
- ✅ Upload de múltiplas fotos do tênis
- ✅ Preenchimento de informações detalhadas (marca, modelo, tamanho, etc.)
- ✅ Acompanhamento do status da avaliação
- ✅ Histórico de itens enviados
- ✅ Visualização de resultados detalhados
- ✅ Pagar por avaliaçoes

### Para Especialistas (Painel Web)
- ✅ Login administrativo
- ✅ Dashboard com estatísticas
- ✅ Lista de itens pendentes de avaliação
- ✅ Interface de avaliação com:
  - Visualização de múltiplas imagens
  - Sistema de classificação (Autêntico/Falsificado/Inconclusivo)
  - Campo para observações
- ✅ Histórico de avaliações realizadas
- ✅ Relatórios e métricas

### Para o Público Geral
- ✅ Página pública com itens avaliados
- ✅ Filtros por status e busca
- ✅ Transparência nas avaliações (Com comentarios)
- ✅ Detalhes completos dos itens (sem dados pessoais)

##  Estrutura do Banco de Dados

### Tabelas Principais

#### Users
- `id`, `name`, `email`, `password`, `role` (user/admin)
- `createdAt`, `updatedAt`

#### Items
- `id`, `title`, `brand`, `model`, `size`, `color`, `description`
- `purchasePrice`, `purchaseDate`, `purchaseLocation`
- `status` (pending/approved/rejected)
- `userId` (foreign key)
- `createdAt`, `updatedAt`

#### ItemImages
- `id`, `itemId`, `filename`, `path`, `mimetype`, `size`
- `createdAt`, `updatedAt`

#### Evaluations
- `id`, `itemId`, `evaluatorId`, `result`, `confidence`, `notes`
- `createdAt`, `updatedAt`

##  API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuario logado

### Itens
- `POST /api/items` - Criar item (com upload de imagens)
- `GET /api/items/my-items` - Itens do usuário logado
- `GET /api/items/public` - Itens públicos avaliados
- `GET /api/items/:id` - Detalhes de um item
- `GET /api/items/stats` - Estatísticas (admin)

### Avaliações
- `POST /api/evaluations` - Criar avaliaçao (admin)
- `GET /api/evaluations/my-evaluations` - Avaliações do especialista
- `GET /api/evaluations/stats` - Estatísticas de avaliações

### Usuários
- `GET /api/users/stats` - Estatísticas de usuários (admin)

##  Design e UX

### Painel Web
- **Design System**: Baseado em shadcn/ui com Tailwind CSS
- **Tema**: Modo claro com cores neutras e acentos em azul
- **Responsividade**: Totalmente responsivo para desktop & mobile (Painel ADM sera apenas WEB)
- **Acessibilidade**: Componentes acessíveis com navegação por teclado

### App Mobile
- **Framework**: React Native com Expo
- **Navegação**: React Navigation
- **UI**: Componentes nativos otimizados
- **Câmera**: Integração nativa para captura de fotos

##  Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Validação de Dados**: Validação tanto no frontend quanto backend
- **Upload Seguro**: Validação de tipos e tamanhos de arquivo
- **Controle de Acesso**: Middleware de autorização por roles
- **Sanitização**: Prevenção contra XSS e SQL Injection
- **Ainda em fase de estudos para melhoria.

##  Monitoramento e Logs

- **Health Check**: Endpoint `/api/health` para verificação do status
- **Logs Estruturados**: Sistema de logs para debugging
- **Métricas**: Estatísticas em tempo real no dashboard admin

##  Deploy e Produção

### Backend
- Configurar variáveis de ambiente (.env)
- Usar PostgreSQL ou MySQL em produção
- Configurar CORS para domínios específicos
- Implementar rate limiting
- Configurar HTTPS

### Frontend Web
- Build de produção: `pnpm run build`
- Deploy em serviços como Vercel, Netlify ou AWS S3
- Configurar variáveis de ambiente para API

### App Mobile
- Build com Expo: `expo build`
- Deploy nas lojas (App Store/Google Play)
- Configurar deep links e notificações push

## Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd web
pnpm test
```

##  Próximos Passos

### Melhorias & Integracoes
1. **Notificações Push**: Avisar usuários sobre status das avaliações
2. **Sistema de Rating**: Avaliação dos especialistas pelos usuários
3. **IA/ML**: Pré-análise automática para auxiliar especialistas
4. **Relatórios Avançados**: Dashboards com mais métricas
5. **API Pública**: Endpoints para integração com terceiros
6. **Chat/Suporte**: Sistema de comunicação entre usuários e especialistas
6. **Integracoes**: Integrar o App mobile que esta sendo desenvolvido ao Backend / Web

### Otimizações Técnicas
1. **Cache**: Implementar Redis para cache de dados
2. **CDN**: Usar CDN para servir imagens e reduzir o armazenamento
3. **Compressão**: Otimizar imagens automaticamente
4. **Monitoramento**: Implementar APM (Application Performance Monitoring)
5. **Backup**: Sistema automatizado de backup do banco

## Equipe e Contribuição

Este esta sendo desenvolvido como metodo de aprendizado, e com pretencao de ser um projeto REAL.

### Estrutura de Pastas
```
trustme/
├── backend/          # API Node.js + Express
│   ├── controllers/  # Lógica de negócio
│   ├── models/       # Modelos do banco de dados
│   ├── routes/       # Definição de rotas
│   ├── middlewares/  # Middlewares de autenticação e upload
│   └── config/       # Configurações do banco
├── web/              # Painel administrativo React
│   ├── src/
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   └── lib/         # Utilitários e API client
├── mobile/           # App React Native + Expo
│   ├── components/   # Componentes do app
│   ├── screens/      # Telas do aplicativo
│   └── services/     # Serviços e API calls
└── shared/           # Código compartilhado
    └── api.js        # Cliente da API
```


---

**TrustMe** - Verificação de Autenticidade Confiável! 🛡️


