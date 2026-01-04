const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do banco SQLite local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false, // Desabilita logs SQL no console
});

// Função para testar a conexão
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' OK - Conexão com o banco de dados estabelecida com sucesso.');
  } catch (error) {
    console.error(' X - Erro ao conectar com o banco de dados:', error);
  }
};

module.exports = { sequelize, testConnection };

