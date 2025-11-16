"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigo: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descricao: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  },
};