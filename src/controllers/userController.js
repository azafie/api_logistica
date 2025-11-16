const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
  // Criar usuário
  async create(req, res) {
    try {
      const { nome, identificador, login, senha, nivel_acesso = 'usuario' } = req.body;
      
      // Validações básicas
      if (!nome || !identificador || !login || !senha) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: nome, identificador, login, senha' 
        });
      }

      // Hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      const user = await User.create({
        nome,
        identificador,
        login,
        senha: senhaHash,
        nivel_acesso
      });

      // Remove senha do retorno
      const userResponse = { ...user.toJSON() };
      delete userResponse.senha;

      return res.status(201).json(userResponse);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Identificador ou login já existe' });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  // Login
  async login(req, res) {
    try {
      const { login, senha } = req.body;
      
      if (!login || !senha) {
        return res.status(400).json({ error: 'Login e senha são obrigatórios' });
      }

      const user = await User.findOne({ where: { login } });
      
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      if (!user.status) {
        return res.status(401).json({ error: 'Usuário inativo' });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      // Gera token JWT
      const token = jwt.sign(
        { 
          id: user.id, 
          login: user.login, 
          nivel_acesso: user.nivel_acesso 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove senha do retorno
      const userResponse = { ...user.toJSON() };
      delete userResponse.senha;

      return res.json({
        user: userResponse,
        token
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar usuários (sem senha)
  async list(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['senha'] },
        order: [['nome', 'ASC']]
      });

      return res.json(users);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar usuário por ID (sem senha)
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['senha'] }
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, identificador, login, senha, status, nivel_acesso } = req.body;
      
      const user = await User.findByPk(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const updateData = {
        nome: nome || user.nome,
        identificador: identificador || user.identificador,
        login: login || user.login,
        status: status !== undefined ? status : user.status,
        nivel_acesso: nivel_acesso || user.nivel_acesso
      };

      // Se tiver nova senha, faz hash
      if (senha) {
        updateData.senha = await bcrypt.hash(senha, 10);
      }

      await user.update(updateData);

      // Remove senha do retorno
      const userResponse = { ...user.toJSON() };
      delete userResponse.senha;

      return res.json(userResponse);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Identificador ou login já existe' });
      }
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;