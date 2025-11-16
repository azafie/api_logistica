module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    tableName: 'order_items',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  OrderItem.associate = function(models) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'pedido'
    });
    
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'produto'
    });
  };

  return OrderItem;
};