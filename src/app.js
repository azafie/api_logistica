const express = require('express');
const estoqueAPI = require('./api/estoqueAPI');
const categoryAPI = require('./api/categoryAPI');
const userAPI = require('./api/userAPI');
const productAPI = require('./api/productAPI');
const orderAPI = require('./api/orderAPI');

const app = express();

// Middlewares com UTF-8
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 100000,
  charset: 'utf-8'
}));

// Header para UTF-8 em todas as respostas
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api', estoqueAPI);
app.use('/api', categoryAPI);
app.use('/api', userAPI);
app.use('/api', productAPI);
app.use('/api', orderAPI);
console.log('✅ orderAPI carregada');

// Rota health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Estoque funcionando!',
    endpoints: {
      health: '/health',
      movimentacoes: '/api/movimentacoes',
      categorias: '/api/categorias',
      usuarios: '/api/users',
      produtos: '/api/products',
      pedidos: '/api/orders'
    }
  });
});

// Middleware de 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('Erro:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;