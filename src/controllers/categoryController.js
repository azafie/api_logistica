const { Category } = require('../models');

const categoryController = {
  // Criar categoria
  async create(req, res) {
    try {
      const { nome, status = true } = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const category = await Category.create({
        nome,
        status
      });

      return res.status(201).json(category);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar categorias
  async list(req, res) {
    try {
      const { status } = req.query;
      
      const where = {};
      if (status !== undefined) where.status = status === 'true';

      const categories = await Category.findAll({
        where,
        order: [['nome', 'ASC']]
      });

      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar categoria por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      return res.json(category);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar categoria
  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, status } = req.body;
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      await category.update({
        nome: nome || category.nome,
        status: status !== undefined ? status : category.status
      });

      return res.json(category);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Deletar categoria
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const category = await Category.findByPk(id);
      
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      await category.destroy();
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = categoryController;