const { EstoqueMovimentacao } = require('../models');
const { Op } = require('sequelize');

const estoqueController = {
  // CREATE - Criar nova movimentação
  async create(req, res) {
    try {
      const { data, tipo, produto, quantidade, usuario_origem, observacoes } = req.body;
      
      const novaMovimentacao = await EstoqueMovimentacao.create({
        data,
        tipo,
        produto,
        quantidade,
        usuario_origem,
        observacoes
      });

      return res.status(201).json(novaMovimentacao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // READ ALL - Listar TODAS as movimentações
  async list(req, res) {
    try {
      const movimentacoes = await EstoqueMovimentacao.findAll({
        order: [['data', 'DESC'], ['created_at', 'DESC']]
      });

      return res.json({
        movimentacoes,
        total: movimentacoes.length
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // READ ONE - Buscar por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const movimentacao = await EstoqueMovimentacao.findByPk(id);
      
      if (!movimentacao) {
        return res.status(404).json({ error: 'Movimentação não encontrada' });
      }

      return res.json(movimentacao);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // UPDATE - Atualizar movimentação
  async update(req, res) {
    try {
      const { id } = req.params;
      const { data, tipo, produto, quantidade, usuario_origem, observacoes } = req.body;

      const movimentacao = await EstoqueMovimentacao.findByPk(id);
      
      if (!movimentacao) {
        return res.status(404).json({ error: 'Movimentação não encontrada' });
      }

      await movimentacao.update({
        data,
        tipo,
        produto,
        quantidade,
        usuario_origem,
        observacoes
      });

      return res.json(movimentacao);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  // DELETE - Deletar movimentação
  async delete(req, res) {
    try {
      const { id } = req.params;

      const movimentacao = await EstoqueMovimentacao.findByPk(id);
      
      if (!movimentacao) {
        return res.status(404).json({ error: 'Movimentação não encontrada' });
      }

      await movimentacao.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // SEARCH - Buscar movimentações
  async search(req, res) {
    try {
      const { term } = req.params;

      const movimentacoes = await EstoqueMovimentacao.findAll({
        where: {
          [Op.or]: [
            { produto: { [Op.iLike]: `%${term}%` } },
            { usuario_origem: { [Op.iLike]: `%${term}%` } },
            { observacoes: { [Op.iLike]: `%${term}%` } }
          ]
        },
        order: [['data', 'DESC']]
      });

      return res.json({
        movimentacoes,
        total: movimentacoes.length,
        searchTerm: term
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = estoqueController;