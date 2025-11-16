const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const { authMiddleware } = require('../middleware/auth');

// Todas as rotas de estoque protegidas
router.post('/movimentacoes', authMiddleware, estoqueController.create);
router.get('/movimentacoes', authMiddleware, estoqueController.list);
router.get('/movimentacoes/:id', authMiddleware, estoqueController.getById);
router.put('/movimentacoes/:id', authMiddleware, estoqueController.update);
router.delete('/movimentacoes/:id', authMiddleware, estoqueController.delete);
router.get('/movimentacoes/search/:term', authMiddleware, estoqueController.search);

module.exports = router;