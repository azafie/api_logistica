const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const productController = {
  // Criar produto
  async create(req, res) {
    try {
      const { codigo, nome, descricao, categoria_id, estoque, preco, status = true } = req.body;
      
      // Validações básicas
      if (!codigo || !nome || !categoria_id || preco === undefined) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: codigo, nome, categoria_id, preco' 
        });
      }

      const product = await Product.create({
        codigo,
        nome,
        descricao,
        categoria_id,
        estoque: estoque || 0,
        preco,
        status
      });

      // Retorna o produto com categoria
      const productWithCategory = await Product.findByPk(product.id, {
        include: [{
          model: Category,
          as: 'categoria',
          attributes: ['id', 'nome']
        }]
      });

      return res.status(201).json(productWithCategory);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Código do produto já existe' });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  // Listar todos os produtos com busca e filtros
  async list(req, res) {
    try {
      const { search, categoria_id, status, page = 1, limit = 10 } = req.query;
      
      const where = {};
      
      // Busca por termo (nome, código ou descrição)
      if (search) {
        where[Op.or] = [
          { nome: { [Op.iLike]: `%${search}%` } },
          { codigo: { [Op.iLike]: `%${search}%` } },
          { descricao: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Filtros
      if (categoria_id) where.categoria_id = categoria_id;
      if (status !== undefined) where.status = status === 'true';

      const offset = (page - 1) * limit;

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [{
          model: Category,
          as: 'categoria',
          attributes: ['id', 'nome']
        }],
        order: [['nome', 'ASC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return res.json({
        products,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar produto por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id, {
        include: [{
          model: Category,
          as: 'categoria',
          attributes: ['id', 'nome']
        }]
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Buscar produto por código (SKU)
  async getByCode(req, res) {
    try {
      const { codigo } = req.params;
      
      const product = await Product.findOne({
        where: { codigo },
        include: [{
          model: Category,
          as: 'categoria',
          attributes: ['id', 'nome']
        }]
      });

      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar produto
  async update(req, res) {
    try {
      const { id } = req.params;
      const { codigo, nome, descricao, categoria_id, estoque, preco, status } = req.body;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.update({
        codigo: codigo || product.codigo,
        nome: nome || product.nome,
        descricao: descricao !== undefined ? descricao : product.descricao,
        categoria_id: categoria_id || product.categoria_id,
        estoque: estoque !== undefined ? estoque : product.estoque,
        preco: preco || product.preco,
        status: status !== undefined ? status : product.status
      });

      const updatedProduct = await Product.findByPk(id, {
        include: [{
          model: Category,
          as: 'categoria',
          attributes: ['id', 'nome']
        }]
      });

      return res.json(updatedProduct);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Código do produto já existe' });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  // Deletar produto
  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.destroy();
      
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // Atualizar estoque do produto
  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { estoque } = req.body;

      if (estoque === undefined) {
        return res.status(400).json({ error: 'Campo estoque é obrigatório' });
      }

      const product = await Product.findByPk(id);
      
      if (!product) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      await product.update({ estoque });

      return res.json(product);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
};

module.exports = productController;