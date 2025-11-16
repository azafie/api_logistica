const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
// const { authMiddleware } = require('../middleware/auth');

// Todas as rotas de categorias protegidas
router.post('/categories', categoryController.create); // REMOVA authMiddleware
router.get('/categories', categoryController.list);
router.get('/categories/:id', categoryController.getById);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.delete);

module.exports = router;