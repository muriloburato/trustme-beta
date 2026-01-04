const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Evaluation = sequelize.define('Evaluation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  result: {
    type: DataTypes.ENUM('authentic', 'fake', 'inconclusive'),
    allowNull: false
  },
  confidence: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  evaluationCriteria: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id'
    }
  },
  evaluatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'evaluations',
  timestamps: true
});

module.exports = Evaluation;

