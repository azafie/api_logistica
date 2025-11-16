'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      numero_pedido: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      cliente_nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cliente_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      cliente_telefone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pendente', 'separacao', 'enviado', 'entregue', 'cancelado'),
        allowNull: false,
        defaultValue: 'pendente'
      },
      valor_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      forma_envio: {
        type: Sequelize.ENUM('correio', 'transportadora', 'moto', 'fiorino', 'caminhao', 'retirada_loja'),
        allowNull: true
      },
      observacoes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      endereco_entrega: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      data_pedido: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
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

    // Índices para performance
    await queryInterface.addIndex('orders', ['numero_pedido']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['data_pedido']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
    
    // Remover o tipo ENUM
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_status;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_orders_forma_envio;');
  }
};