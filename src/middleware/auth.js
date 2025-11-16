const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Remove "Bearer " do token se existir
    const tokenClean = token.replace('Bearer ', '');
    
    const decoded = jwt.verify(tokenClean, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona os dados do usuário na request
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Middleware para verificar se é admin
const adminMiddleware = (req, res, next) => {
  if (req.user.nivel_acesso !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Necessário nível admin.' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };