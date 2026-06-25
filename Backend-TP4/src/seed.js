const {
  User,
  House,
  Category,
  Product,
  Batch
} = require('./models');

async function seedDatabase() {

  const usersCount = await User.count();

  if (usersCount > 0) {
    return;
  }

  // ==========================
  // Usuarios
  // ==========================

  const mateo = await User.create({
    username: 'mateo',
    password: '1234'
  });

  const nicolas = await User.create({
    username: 'nicolas',
    password: '1234'
  });

  // ==========================
  // Casas
  // ==========================

  const casa1 = await House.create({
    name: 'Casa 1'
  });

  const casa2 = await House.create({
    name: 'Casa 2'
  });

  await mateo.addHouses([casa1, casa2]);
  await nicolas.addHouses([casa1, casa2]);

  // ==========================
  // Categorías
  // ==========================

  const lacteos = await Category.create({
    name: 'Lácteos'
  });

  const bebidas = await Category.create({
    name: 'Bebidas'
  });

  const almacen = await Category.create({
    name: 'Almacén'
  });

  // ==========================
  // Productos
  // ==========================

  const leche = await Product.create({
    name: 'Leche',
    minimumStock: 5,
    categoryId: lacteos.id
  });

  const queso = await Product.create({
    name: 'Queso',
    minimumStock: 5,
    categoryId: lacteos.id
  });

  const manteca = await Product.create({
    name: 'Manteca',
    minimumStock: 3,
    categoryId: lacteos.id
  });

  const coca = await Product.create({
    name: 'Coca Cola',
    minimumStock: 6,
    categoryId: bebidas.id
  });

  const arroz = await Product.create({
    name: 'Arroz',
    minimumStock: 4,
    categoryId: almacen.id
  });

  // ==========================
  // LOTES CASA 1
  // ==========================

  await Batch.create({
    productId: leche.id,
    houseId: casa1.id,
    quantity: 10,
    expirationDate: new Date('2026-08-15')
  });

  await Batch.create({
    productId: leche.id,
    houseId: casa1.id,
    quantity: 6,
    expirationDate: new Date('2026-09-20')
  });

  await Batch.create({
    productId: queso.id,
    houseId: casa1.id,
    quantity: 5,
    expirationDate: new Date('2026-08-01')
  });

  await Batch.create({
    productId: manteca.id,
    houseId: casa1.id,
    quantity: 2,
    expirationDate: new Date('2026-07-30')
  });

  await Batch.create({
    productId: coca.id,
    houseId: casa1.id,
    quantity: 12,
    expirationDate: new Date('2027-01-01')
  });

  // ==========================
  // LOTES CASA 2
  // ==========================

  await Batch.create({
    productId: leche.id,
    houseId: casa2.id,
    quantity: 8,
    expirationDate: new Date('2026-10-05')
  });

  await Batch.create({
    productId: arroz.id,
    houseId: casa2.id,
    quantity: 20,
    expirationDate: new Date('2027-03-01')
  });

  await Batch.create({
    productId: coca.id,
    houseId: casa2.id,
    quantity: 15,
    expirationDate: new Date('2027-02-10')
  });

  console.log('Datos iniciales cargados');
}

module.exports = seedDatabase;