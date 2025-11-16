module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    tableName: 'products',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = function(models) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoria_id',
      as: 'categoria'
    });
  };

  return Product;
};