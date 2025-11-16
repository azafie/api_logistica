const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// Todas as rotas de pedidos PROTEGIDAS
router.get('/orders', authMiddleware, orderController.list);
router.post('/orders', authMiddleware, orderController.create);
router.get('/orders/:id', authMiddleware, orderController.getById);
router.patch('/orders/:id/status', authMiddleware, orderController.updateStatus);
router.patch('/orders/:id/enviar', authMiddleware, orderController.enviarPedido);
router.delete('/orders/:id', authMiddleware, orderController.delete);

module.exports = router;