const path = require('path');
const { Sequelize } = require('sequelize');

const sqliteStorage =
  process.env.NODE_ENV === 'test'
    ? ':memory:'
    : path.resolve(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: sqliteStorage,
  logging: false
});

const Category = require('./category')(sequelize);
const Product = require('./product')(sequelize);
const Batch = require('./batch')(sequelize);
const Movement = require('./movement')(sequelize);
const User = require('./user')(sequelize);
const House = require('./house')(sequelize);

Category.hasMany(Product, {foreignKey: 'categoryId',as: 'products'});
Product.belongsTo(Category, {foreignKey: 'categoryId',as: 'category'});
Product.hasMany(Batch, {foreignKey: 'productId',as: 'batches'});
Batch.belongsTo(Product, {foreignKey: 'productId',as: 'product'});
Batch.hasMany(Movement, {foreignKey: 'batchId',as: 'movements'});
Movement.belongsTo(Batch, {foreignKey: 'batchId',as: 'batch'});
User.belongsToMany(House, {through: 'user_houses',as: 'houses'});
House.belongsToMany(User, {through: 'user_houses',as: 'users'});
House.hasMany(Batch, {foreignKey: 'houseId',as: 'batches'});
Batch.belongsTo(House, {foreignKey: 'houseId',as: 'house'});
module.exports = {
  sequelize,
  User,
  House,
  Category,
  Product,
  Batch,
  Movement
};