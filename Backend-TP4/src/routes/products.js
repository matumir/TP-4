const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const router = express.Router();

const validateProductData = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('minimumStock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum stock must be >= 0'),

  body('categoryId')
    .optional({ nullable: true })
    .isInt({ gt: 0 })
    .withMessage('Category id must be a positive integer'),

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

const validateProductId = [
  param('productId')
    .isInt({ gt: 0 })
    .withMessage('Product id must be a positive integer'),

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

const getAllProducts = async (req, res) => {
  const { name, category } = req.query;

  const productWhere = {};

  if (name) {
    productWhere.name = {
      [Op.like]: `%${name}%`
    };
  }

  const categoryInclude = {
    model: Category,
    as: 'category',
    attributes: ['id', 'name'],
    required: false
  };

  if (category) {
    categoryInclude.where = {
      name: {
        [Op.like]: `%${category}%`
      }
    };

    categoryInclude.required = true;
  }

  const products = await Product.findAll({
    where: productWhere,
    include: categoryInclude
  });

  res.status(200).json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findByPk(req.params.productId, {
    include: {
      model: Category,
      as: 'category'
    }
  });

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  res.json(product);
};

const addProduct = async (req, res) => {
  const {
    name,
    minimumStock,
    categoryId
  } = req.body;

  if (categoryId) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(400).json({
        message: 'Category not found'
      });
    }
  }

  const product = await Product.create({
    name,
    minimumStock: minimumStock || 0,
    categoryId: categoryId || null
  });

  const productWithCategory = await Product.findByPk(product.id, {
    include: {
      model: Category,
      as: 'category'
    }
  });

  res.status(201).json(productWithCategory);
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;

  const {
    name,
    minimumStock,
    categoryId
  } = req.body;

  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  if (categoryId) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(400).json({
        message: 'Category not found'
      });
    }
  }

  await product.update({
    name,
    minimumStock,
    categoryId: categoryId || null
  });

  const updatedProduct = await Product.findByPk(product.id, {
    include: {
      model: Category,
      as: 'category'
    }
  });

  res.json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  const deletedCount = await Product.destroy({
    where: {
      id: req.params.productId
    }
  });

  if (!deletedCount) {
    return res.status(404).json({
      message: 'Product not found'
    });
  }

  res.status(204).send();
};

router.get('/', getAllProducts);
router.get('/:productId', validateProductId, getProductById);
router.post('/', validateProductData, addProduct);
router.put(
  '/:productId',
  [...validateProductId, ...validateProductData],
  updateProduct
);
router.delete('/:productId', validateProductId, deleteProduct);

module.exports = router;