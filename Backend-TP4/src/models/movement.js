const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Movement', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    type: {
      type: DataTypes.ENUM('ENTRY', 'EXIT'),
      allowNull: false
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }

  }, {
    timestamps: true,
    tableName: 'movements'
  });
};