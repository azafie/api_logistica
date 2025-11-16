// src/migrations/XXXXXXXXXXXXXX-create-estoque-movimentacoes.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('estoque_movimentacoes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('entrada', 'saida'),
        allowNull: false
      },
      produto: {
        type: Sequelize.STRING,
        allowNull: false
      },
      quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      usuario_origem: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Adicionar índices para melhor performance no PostgreSQL
    await queryInterface.addIndex('estoque_movimentacoes', ['data']);
    await queryInterface.addIndex('estoque_movimentacoes', ['tipo']);
    await queryInterface.addIndex('estoque_movimentacoes', ['produto']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('estoque_movimentacoes');
    
    // Remover o tipo ENUM criado
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_estoque_movimentacoes_tipo;');
  }
};