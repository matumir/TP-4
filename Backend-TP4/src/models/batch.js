const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Batch', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    timestamps: false,
    tableName: 'batches'
  });
};