const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Batch, Product } = require('../models');

const router = express.Router();

const validateBatch = [
  body('productId')
    .isInt({ gt: 0 })
    .withMessage('Product id is required'),

  body('quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be greater than 0'),

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
  const batches = await Batch.findAll({
    include: {
      model: Product,
      as: 'product'
    }
  });

  res.json(batches);
});

router.get('/:batchId', async (req, res) => {
  const batch = await Batch.findByPk(req.params.batchId);

  if (!batch) {
    return res.status(404).json({
      message: 'Batch not found'
    });
  }

  res.json(batch);
});

router.post('/', validateBatch, async (req, res) => {

  const {
    productId,
    quantity,
    expirationDate
  } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  const batch = await Batch.create({
    productId,
    quantity,
    expirationDate
  });

  res.status(201).json(batch);
});

router.put('/:batchId', validateBatch, async (req, res) => {

  const batch = await Batch.findByPk(req.params.batchId);

  if (!batch) {
    return res.status(404).json({
      message: 'Batch not found'
    });
  }

  await batch.update(req.body);

  res.json(batch);
});

router.delete('/:batchId', async (req, res) => {

  const deleted = await Batch.destroy({
    where: {
      id: req.params.batchId
    }
  });

  if (!deleted) {
    return res.status(404).json({
      message: 'Batch not found'
    });
  }

  res.status(204).send();
});

module.exports = router;