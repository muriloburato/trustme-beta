# 🚀 Guia de Instalação - TrustMe

Este guia fornece instruções passo a passo para configurar e executar a plataforma TrustMe em seu ambiente local.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **pnpm** (recomendado)
- **Git** para clonar o repositório
- **Expo CLI** (para desenvolvimento mobile)

### Verificando as Instalações

```bash
node --version    # Deve ser 18+
npm --version     # ou pnpm --version
git --version
```

## 📁 Estrutura do Projeto

```
trustme/
├── backend/      # API Node.js + Express
├── web/          # Painel administrativo React
├── mobile/       # App React Native + Expo
└── shared/       # Código compartilhado
```

## 🔧 Instalação Passo a Passo

### 1. Backend (API)

```bash
# Navegar para o diretório do backend
cd trustme/backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env  # Se existir, ou criar manualmente

# Iniciar o servidor
npm start
```

**Verificação**: O servidor deve estar rodando em `http://localhost:3001`

#### Variáveis de Ambiente (.env)
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=seu_jwt_secret_aqui
DB_PATH=./database.sqlite
UPLOAD_PATH=./uploads
```

### 2. Painel Web (Administrativo)

```bash
# Navegar para o diretório web
cd trustme/web

# Instalar dependências (usando pnpm - recomendado)
pnpm install
# ou usando npm
npm install

# Iniciar o servidor de desenvolvimento
pnpm run dev --host
# ou
npm run dev -- --host
```

**Verificação**: O painel deve estar disponível em `http://localhost:5173`

### 3. App Mobile (Expo)

```bash
# Navegar para o diretório mobile
cd trustme/mobile

# Instalar dependências
npm install

# Instalar Expo CLI globalmente (se não tiver)
npm install -g @expo/cli

# Iniciar o projeto
npm run web      # Para testar no navegador
# ou
npm run android  # Para Android (requer Android Studio)
npm run ios      # Para iOS (requer macOS e Xcode)
```

## 🗄️ Configuração do Banco de Dados

O projeto usa SQLite por padrão para desenvolvimento local. O banco será criado automaticamente na primeira execução.

### Estrutura das Tabelas

O Sequelize criará automaticamente as seguintes tabelas:
- `Users` - Usuários e administradores
- `Items` - Itens enviados para avaliação
- `ItemImages` - Imagens dos itens
- `Evaluations` - Avaliações dos especialistas

## 👤 Criando um Usuário Administrador

Para acessar o painel administrativo, você precisa criar um usuário com role 'admin':

### Opção 1: Via API (Recomendado)

```bash
# Com o backend rodando, faça uma requisição POST
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@trustme.com",
    "password": "admin123",
    "role": "admin"
  }'
```

### Opção 2: Diretamente no Banco

```bash
# Acessar o banco SQLite
cd trustme/backend
sqlite3 database.sqlite

# Inserir usuário admin (ajustar o hash da senha)
INSERT INTO Users (name, email, password, role, createdAt, updatedAt) 
VALUES ('Admin', 'admin@trustme.com', '$2b$10$hash_da_senha', 'admin', datetime('now'), datetime('now'));
```

## 🧪 Testando a Instalação

### 1. Teste do Backend
```bash
# Health check
curl http://localhost:3001/api/health

# Deve retornar: {"status": "OK", "timestamp": "..."}
```

### 2. Teste do Painel Web
- Acesse `http://localhost:5173`
- Clique em "Login Admin"
- Use as credenciais criadas anteriormente

### 3. Teste do App Mobile
- Execute `npm run web` no diretório mobile
- Acesse o link fornecido pelo Expo

## 🔧 Solução de Problemas

### Erro de Porta em Uso
```bash
# Verificar processos usando as portas
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Matar processo se necessário
kill -9 PID
```

### Erro de Dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de Permissões (Upload)
```bash
# Criar diretório de uploads
mkdir -p trustme/backend/uploads
chmod 755 trustme/backend/uploads
```

### Erro de CORS
Certifique-se de que o backend está configurado para aceitar requisições do frontend:

```javascript
// backend/app.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:19006'],
  credentials: true
}));
```

## 📱 Desenvolvimento Mobile

### Para Android
1. Instale o Android Studio
2. Configure o Android SDK
3. Execute `npm run android`

### Para iOS (apenas macOS)
1. Instale o Xcode
2. Execute `npm run ios`

### Para Web (Desenvolvimento)
```bash
npm run web
```

## 🚀 Próximos Passos

Após a instalação bem-sucedida:

1. **Explore o Painel Admin**: Faça login e familiarize-se com a interface
2. **Teste o Upload**: Use o app mobile para enviar fotos de teste
3. **Faça uma Avaliação**: Use o painel admin para avaliar itens
4. **Verifique a Página Pública**: Veja os itens avaliados publicamente

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os logs do console
2. Confirme que todas as dependências estão instaladas
3. Verifique se as portas não estão em uso
4. Consulte a documentação das tecnologias utilizadas

---

**Boa sorte com o TrustMe!** 🛡️

