const express = require('express');
const { body, validationResult } = require('express-validator');
const { Movement, Product } = require('../models');

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
      model: Product,
      as: 'product'
    }
  });

  res.json(movements);
});

router.post('/', validateMovement, async (req, res) => {
  const { type, quantity, productId } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  if (type === 'ENTRY') {
    product.currentStock += quantity;
  }

  if (type === 'EXIT') {

    if (product.currentStock < quantity) {
      return res.status(400).json({
        message: 'Not enough stock'
      });
    }

    product.currentStock -= quantity;
  }

  await product.save();

  const movement = await Movement.create({
    type,
    quantity,
    productId
  });

  res.status(201).json(movement);
});

module.exports = router;