const {
  User,
  House,
  Category,
  Product
} = require('./models');

async function seedDatabase() {

  const usersCount = await User.count();

  if (usersCount > 0) {
    return;
  }

  const mateo = await User.create({
    username: 'mateo',
    password: '1234'
  });

  const nicolas = await User.create({
    username: 'nicolas',
    password: '1234'
  });

  const casa1 = await House.create({
    name: 'Casa 1'
  });

  const casa2 = await House.create({
    name: 'Casa 2'
  });

  await mateo.addHouses([casa1, casa2]);
  await nicolas.addHouses([casa1, casa2]);

  const lacteos = await Category.create({
    name: 'Lácteos'
  });

  await Product.create({
    name: 'Leche',
    minimumStock: 5,
    categoryId: lacteos.id
  });

  await Product.create({
    name: 'Queso',
    minimumStock: 5,
    categoryId: lacteos.id
  });

  await Product.create({
    name: 'Manteca',
    minimumStock: 5,
    categoryId: lacteos.id
  });

  console.log('Datos iniciales cargados');
}

module.exports = seedDatabase;