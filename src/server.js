// NO TOPO do src/server.js
require('dotenv').config(); // ← ADICIONE ESTA LINHA

console.log('🔐 JWT_SECRET carregado:', process.env.JWT_SECRET ? 'SIM' : 'NÃO');
console.log('🐘 DB_HOST carregado:', process.env.DB_HOST ? 'SIM' : 'NÃO');

const app = require('./app');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 API de estoque disponível em: http://localhost:${PORT}/api`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();