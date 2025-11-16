// src/routes/estoqueRoutes.js
const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');

// CRUD completo
router.post('/movimentacoes', estoqueController.create);
router.get('/movimentacoes', estoqueController.getAll);
router.get('/movimentacoes/:id', estoqueController.getById);
router.put('/movimentacoes/:id', estoqueController.update);
router.delete('/movimentacoes/:id', estoqueController.delete);

// Busca específica
router.get('/movimentacoes/buscar/:termo', estoqueController.search);

module.exports = router;