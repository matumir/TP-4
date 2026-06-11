const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    currentStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    minimumStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },

    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'products'
  });
};