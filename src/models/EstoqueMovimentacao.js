// src/models/estoquemovimentacao.js
module.exports = (sequelize, DataTypes) => {
  const EstoqueMovimentacao = sequelize.define('EstoqueMovimentacao', {
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'saida'),
      allowNull: false
    },
    produto: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    usuario_origem: {
      type: DataTypes.STRING,
      allowNull: false
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'estoque_movimentacoes',
    timestamps: true,
    underscored: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return EstoqueMovimentacao;
};