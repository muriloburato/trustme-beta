const { Evaluation, Item, User } = require('../models');

// Criar avaliação (apenas admin)
const createEvaluation = async (req, res) => {
  try {
    const { itemId, result, confidence, notes, evaluationCriteria } = req.body;

    // Verificar se o item existe
    const item = await Item.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Verificar se já existe uma avaliação para este item
    const existingEvaluation = await Evaluation.findOne({ where: { itemId } });
    if (existingEvaluation) {
      return res.status(400).json({ error: 'Item já foi avaliado' });
    }

    // Criar avaliação
    const evaluation = await Evaluation.create({
      itemId,
      result,
      confidence,
      notes,
      evaluationCriteria: evaluationCriteria || {},
      evaluatorId: req.userId
    });

    // Atualizar status do item baseado na avaliação
    let itemStatus = 'pending';
    if (result === 'authentic') {
      itemStatus = 'approved';
    } else if (result === 'fake') {
      itemStatus = 'rejected';
    }

    await item.update({ status: itemStatus });

    // Buscar avaliação completa
    const evaluationWithDetails = await Evaluation.findByPk(evaluation.id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'name']
        }
      ]
    });

    res.status(201).json({
      message: 'Avaliação criada com sucesso',
      evaluation: evaluationWithDetails
    });
  } catch (error) {
    console.error('Erro ao criar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar todas as avaliações
const getAllEvaluations = async (req, res) => {
  try {
    const { result, evaluatorId, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (result) where.result = result;
    if (evaluatorId) where.evaluatorId = evaluatorId;

    const offset = (page - 1) * limit;

    const { count, rows: evaluations } = await Evaluation.findAndCountAll({
      where,
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      evaluations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar avaliações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter avaliação por ID
const getEvaluationById = async (req, res) => {
  try {
    const { id } = req.params;

    const evaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json({ evaluation });
  } catch (error) {
    console.error('Erro ao obter avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar avaliação (apenas o avaliador original ou admin)
const updateEvaluation = async (req, res) => {
  try {
    const { id } = req.params;
    const { result, confidence, notes, evaluationCriteria } = req.body;

    const evaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: Item,
          as: 'item'
        }
      ]
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    // Verificar se o usuário é o avaliador original ou admin
    if (evaluation.evaluatorId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Atualizar avaliação
    await evaluation.update({
      result: result || evaluation.result,
      confidence: confidence || evaluation.confidence,
      notes: notes || evaluation.notes,
      evaluationCriteria: evaluationCriteria || evaluation.evaluationCriteria
    });

    // Atualizar status do item se o resultado mudou
    if (result && result !== evaluation.result) {
      let itemStatus = 'pending';
      if (result === 'authentic') {
        itemStatus = 'approved';
      } else if (result === 'fake') {
        itemStatus = 'rejected';
      }
      await evaluation.item.update({ status: itemStatus });
    }

    // Buscar avaliação atualizada
    const updatedEvaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'evaluator',
          attributes: ['id', 'name']
        }
      ]
    });

    res.json({
      message: 'Avaliação atualizada com sucesso',
      evaluation: updatedEvaluation
    });
  } catch (error) {
    console.error('Erro ao atualizar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar avaliação (apenas admin)
const deleteEvaluation = async (req, res) => {
  try {
    const { id } = req.params;

    const evaluation = await Evaluation.findByPk(id, {
      include: [
        {
          model: Item,
          as: 'item'
        }
      ]
    });

    if (!evaluation) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    // Resetar status do item para pendente
    await evaluation.item.update({ status: 'pending' });

    // Deletar avaliação
    await evaluation.destroy();

    res.json({ message: 'Avaliação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar avaliação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter avaliações do avaliador logado
const getMyEvaluations = async (req, res) => {
  try {
    const { result, page = 1, limit = 10 } = req.query;
    
    const where = { evaluatorId: req.userId };
    if (result) where.result = result;

    const offset = (page - 1) * limit;

    const { count, rows: evaluations } = await Evaluation.findAndCountAll({
      where,
      include: [
        {
          model: Item,
          as: 'item',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      evaluations,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao obter minhas avaliações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter estatísticas das avaliações
const getEvaluationStats = async (req, res) => {
  try {
    const totalEvaluations = await Evaluation.count();
    const authenticItems = await Evaluation.count({ where: { result: 'authentic' } });
    const fakeItems = await Evaluation.count({ where: { result: 'fake' } });
    const inconclusiveItems = await Evaluation.count({ where: { result: 'inconclusive' } });

    // Estatísticas por avaliador
    const evaluatorStats = await Evaluation.findAll({
      attributes: [
        'evaluatorId',
        [Evaluation.sequelize.fn('COUNT', Evaluation.sequelize.col('id')), 'count']
      ],
      include: [
        {
          model: User,
          as: 'evaluator',
          attributes: ['name']
        }
      ],
      group: ['evaluatorId'],
      order: [[Evaluation.sequelize.fn('COUNT', Evaluation.sequelize.col('id')), 'DESC']]
    });

    res.json({
      stats: {
        total: totalEvaluations,
        authentic: authenticItems,
        fake: fakeItems,
        inconclusive: inconclusiveItems,
        byEvaluator: evaluatorStats
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getMyEvaluations,
  getEvaluationStats
};

