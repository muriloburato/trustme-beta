const express = require('express');
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  getItemStats
} = require('../controllers/itemController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middlewares/authMiddleware');
const { uploadImages, handleUploadError } = require('../middlewares/uploadMiddleware');

const router = express.Router();

// Rotas públicas (com autenticação opcional)
router.get('/public', optionalAuth, getAllItems);
router.get('/public/:id', optionalAuth, getItemById);

// Rotas administrativas (antes das rotas autenticadas)
router.get('/stats', authenticateToken, requireAdmin, getItemStats);

// Rotas que requerem autenticação
router.use(authenticateToken);

// Rotas para usuários autenticados
router.post('/', uploadImages, handleUploadError, createItem);
router.get('/my-items', getMyItems);
router.get('/:id', getItemById);
router.put('/:id', uploadImages, handleUploadError, updateItem);
router.delete('/:id', deleteItem);

// Rota administrativa geral
router.get('/', requireAdmin, getAllItems);

module.exports = router;

