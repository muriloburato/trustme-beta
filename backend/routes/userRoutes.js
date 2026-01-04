const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  promoteToAdmin,
  getUserStats
} = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Rotas que requerem privilégios de admin
router.get('/', requireAdmin, getAllUsers);
router.get('/stats', requireAdmin, getUserStats);
router.get('/:id', requireAdmin, getUserById);
router.put('/:id/status', requireAdmin, updateUserStatus);
router.put('/:id/promote', requireAdmin, promoteToAdmin);

module.exports = router;

