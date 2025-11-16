const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const { authMiddleware } = require('../middleware/auth'); // COMENTE

// Todas as rotas de produtos protegidas
router.post('/products', productController.create); // REMOVA authMiddleware
router.get('/products', productController.list);
router.get('/products/:id', productController.getById);
router.get('/products/codigo/:codigo', productController.getByCode);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);
router.patch('/products/:id/estoque', productController.updateStock);

module.exports = router;