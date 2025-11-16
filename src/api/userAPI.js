const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Rotas públicas
router.post('/users/login', userController.login);
router.post('/users', userController.create);

// Rotas protegidas (sem auth temporariamente)
router.get('/users', userController.list); // REMOVA authMiddleware
router.get('/users/:id', userController.getById);
router.put('/users/:id', userController.update);

module.exports = router;