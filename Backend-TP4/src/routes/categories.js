const express = require('express');
const { body, validationResult } = require('express-validator');
const { Category } = require('../models');

const router = express.Router();

const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

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
  const categories = await Category.findAll();
  res.json(categories);
});

router.get('/:categoryId', async (req, res) => {
  const category = await Category.findByPk(req.params.categoryId);

  if (!category) {
    return res.status(404).json({
      message: 'Category not found'
    });
  }

  res.json(category);
});

router.post('/', validateCategory, async (req, res) => {
  const category = await Category.create({
    name: req.body.name
  });

  res.status(201).json(category);
});

router.put('/:categoryId', validateCategory, async (req, res) => {
  const category = await Category.findByPk(req.params.categoryId);

  if (!category) {
    return res.status(404).json({
      message: 'Category not found'
    });
  }

  await category.update({
    name: req.body.name
  });

  res.json(category);
});

router.delete('/:categoryId', async (req, res) => {
  const deletedCount = await Category.destroy({
    where: {
      id: req.params.categoryId
    }
  });

  if (!deletedCount) {
    return res.status(404).json({
      message: 'Category not found'
    });
  }

  res.status(204).send();
});

module.exports = router;