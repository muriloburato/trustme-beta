const { Item, User, Evaluation } = require('../models');
const path = require('path');
const fs = require('fs').promises;

// Criar novo item
const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      model,
      size,
      color,
      purchasePrice,
      purchaseDate,
      purchaseLocation
    } = req.body;

    // Processar imagens enviadas
    const images = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: `/uploads/${file.filename}`,
      size: file.size
    })) : [];

    const item = await Item.create({
      title,
      description,
      brand,
      model,
      size,
      color,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : null,
      purchaseDate: purchaseDate || null,
      purchaseLocation,
      images,
      userId: req.userId
    });

    // Buscar o item criado com dados do usuário
    const itemWithUser = await Item.findByPk(item.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Item criado com sucesso',
      item: itemWithUser
    });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Listar todos os itens
const getAllItems = async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Evaluation,
          as: 'evaluation',
          include: [
            {
              model: User,
              as: 'evaluator',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      items,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar itens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter item por ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Evaluation,
          as: 'evaluation',
          include: [
            {
              model: User,
              as: 'evaluator',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    res.json({ item });
  } catch (error) {
    console.error('Erro ao obter item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Atualizar item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      brand,
      model,
      size,
      color,
      purchasePrice,
      purchaseDate,
      purchaseLocation
    } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Verificar se o usuário é o dono do item ou admin
    if (item.userId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Processar novas imagens se enviadas
    let images = item.images;
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/uploads/${file.filename}`,
        size: file.size
      }));
      images = [...images, ...newImages];
    }

    await item.update({
      title: title || item.title,
      description: description || item.description,
      brand: brand || item.brand,
      model: model || item.model,
      size: size || item.size,
      color: color || item.color,
      purchasePrice: purchasePrice ? parseFloat(purchasePrice) : item.purchasePrice,
      purchaseDate: purchaseDate || item.purchaseDate,
      purchaseLocation: purchaseLocation || item.purchaseLocation,
      images
    });

    const updatedItem = await Item.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Item atualizado com sucesso',
      item: updatedItem
    });
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Deletar item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    // Verificar se o usuário é o dono do item ou admin
    if (item.userId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Deletar imagens do sistema de arquivos
    if (item.images && item.images.length > 0) {
      for (const image of item.images) {
        try {
          const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
          await fs.unlink(imagePath);
        } catch (err) {
          console.error('Erro ao deletar imagem:', err);
        }
      }
    }

    await item.destroy();

    res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter itens do usuário logado
const getMyItems = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const where = { userId: req.userId };
    if (status) where.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: items } = await Item.findAndCountAll({
      where,
      include: [
        {
          model: Evaluation,
          as: 'evaluation',
          include: [
            {
              model: User,
              as: 'evaluator',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      items,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao obter meus itens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Obter estatísticas dos itens
const getItemStats = async (req, res) => {
  try {
    const totalItems = await Item.count();
    const pendingItems = await Item.count({ where: { status: 'pending' } });
    const approvedItems = await Item.count({ where: { status: 'approved' } });
    const rejectedItems = await Item.count({ where: { status: 'rejected' } });

    res.json({
      stats: {
        total: totalItems,
        pending: pendingItems,
        approved: approvedItems,
        rejected: rejectedItems
      }
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  getItemStats
};

