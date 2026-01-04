const express = require('express');
const {
  createEvaluation,
  getAllEvaluations,
  getEvaluationById,
  updateEvaluation,
  deleteEvaluation,
  getMyEvaluations,
  getEvaluationStats
} = require('../controllers/evaluationController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rotas públicas (com autenticação opcional)
router.get('/public', optionalAuth, getAllEvaluations);
router.get('/public/:id', optionalAuth, getEvaluationById);

// Rotas administrativas (antes das rotas autenticadas)
router.get('/stats', authenticateToken, requireAdmin, getEvaluationStats);

// Rotas que requerem autenticação
router.use(authenticateToken);

// Rotas para admins (avaliadores)
router.post('/', requireAdmin, createEvaluation);
router.get('/my-evaluations', requireAdmin, getMyEvaluations);
router.put('/:id', requireAdmin, updateEvaluation);
router.get('/:id', requireAdmin, getEvaluationById);
router.delete('/:id', requireAdmin, deleteEvaluation);

// Rota administrativa geral
router.get('/', requireAdmin, getAllEvaluations);

module.exports = router;

