const express = require('express');
const { body, validationResult } = require('express-validator');
const { Movement, Batch, Product } = require('../models');

const router = express.Router();

const validateMovement = [
  body('type')
    .isIn(['ENTRY', 'EXIT'])
    .withMessage('Type must be ENTRY or EXIT'),

  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be greater than 0'),

  body('productId')
    .isInt({ gt: 0 })
    .withMessage('Product id is required'),

  body('expirationDate')
    .isISO8601()
    .withMessage('Expiration date is invalid'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    next();
  }
];

router.get('/', async (req, res) => {
  const movements = await Movement.findAll({
    include: {
      model: Batch,
      as: 'batch',
      include: {
        model: Product,
        as: 'product'
      }
    }
  });

  res.json(movements);
});

router.post('/', validateMovement, async (req, res) => {

  const {
    type,
    quantity,
    productId,
    expirationDate
  } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  let batch = await Batch.findOne({
    where: {
      productId,
      expirationDate
    }
  });

  if (type === 'ENTRY') {

    if (!batch) {
      batch = await Batch.create({
        productId,
        expirationDate,
        quantity: 0
      });
    }

    batch.quantity += quantity;

    await batch.save();
  }

  if (type === 'EXIT') {

    if (!batch) {
      return res.status(404).json({
        message: 'Batch not found for that expiration date'
      });
    }

    if (batch.quantity < quantity) {
      return res.status(400).json({
        message: 'Not enough stock in batch'
      });
    }

    batch.quantity -= quantity;

    await batch.save();
  }

  const movement = await Movement.create({
    type,
    quantity,
    batchId: batch.id
  });

  res.status(201).json({
    movement,
    batch
  });
});

module.exports = router;