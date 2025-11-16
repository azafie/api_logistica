module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    numero_pedido: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    cliente_nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cliente_email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cliente_telefone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pendente', 'separacao', 'enviado', 'entregue', 'cancelado'),
      allowNull: false,
      defaultValue: 'pendente'
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    forma_envio: {
      type: DataTypes.ENUM('correio', 'transportadora', 'moto', 'fiorino', 'caminhao', 'retirada_loja'),
      allowNull: true
    },
    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    endereco_entrega: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_pedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'orders',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Order.associate = function(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'itens'
    });
  };

  return Order;
};