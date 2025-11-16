module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    identificador: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    nivel_acesso: {
      type: DataTypes.ENUM('admin', 'usuario'),
      allowNull: false,
      defaultValue: 'usuario'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};