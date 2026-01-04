const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/db');

// Importar modelos para garantir que as associações sejam carregadas
require('./models');

// Importar rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

const app = express();

// Middlewares globais
app.use(cors({
  origin: '*', // Permite todas as origens para desenvolvimento
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/evaluations', evaluationRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'TrustMe API está funcionando!', 
    timestamp: new Date().toISOString() 
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ 
    error: 'Algo deu errado!', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno do servidor' 
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar banco de dados
const initializeDatabase = async () => {
  try {
    await testConnection();
    await sequelize.sync({ force: false }); // force: true recria as tabelas
    console.log('✅ Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao sincronizar banco de dados:', error);
  }
};

module.exports = { app, initializeDatabase };

