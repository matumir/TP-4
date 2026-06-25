const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const categoriesRouter = require('./routes/categories');
const movementsRouter = require('./routes/movements');
const batchesRouter = require('./routes/batches');
const usersRouter = require('./routes/users');
const housesRouter = require('./routes/houses');
const seedDatabase = require('./seed');
const { sequelize } = require('./models');

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/movements', movementsRouter);
app.use('/api/batches', batchesRouter);
app.use('/api/users', usersRouter);
app.use('/api/houses', housesRouter);
// Start the HTTP server only when app.js is executed directly.
// This allows the app to be imported by tests without opening a listener.
const startServer = async () => {
  await sequelize.sync();
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
