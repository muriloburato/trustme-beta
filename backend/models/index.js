const User = require('./User');
const Item = require('./Item');
const Evaluation = require('./Evaluation');

// Definir associações entre os modelos

// Um usuário pode ter muitos itens
User.hasMany(Item, {
  foreignKey: 'userId',
  as: 'items'
});

// Um item pertence a um usuário
Item.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Um item pode ter uma avaliação
Item.hasOne(Evaluation, {
  foreignKey: 'itemId',
  as: 'evaluation'
});

// Uma avaliação pertence a um item
Evaluation.belongsTo(Item, {
  foreignKey: 'itemId',
  as: 'item'
});

// Um usuário (admin) pode fazer muitas avaliações
User.hasMany(Evaluation, {
  foreignKey: 'evaluatorId',
  as: 'evaluations'
});

// Uma avaliação é feita por um usuário (admin)
Evaluation.belongsTo(User, {
  foreignKey: 'evaluatorId',
  as: 'evaluator'
});

module.exports = {
  User,
  Item,
  Evaluation
};

