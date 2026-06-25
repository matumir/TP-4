const express = require("express");
const { body, param, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const {
    Product,
    Category,
    Batch,
    House
} = require("../models");

const router = express.Router();

/*
====================================
VALIDACIONES
====================================
*/

const validateProduct = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio"),

    body("minimumStock")
        .isInt({ min: 0 })
        .withMessage("El stock mínimo debe ser mayor o igual a 0"),

    body("categoryId")
        .isInt({ gt: 0 })
        .withMessage("La categoría es obligatoria"),

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

const validateId = [

    param("productId")
        .isInt({ gt: 0 }),

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

/*
====================================
GET TODOS LOS PRODUCTOS
====================================
*/

router.get("/", async (req, res) => {

    try {

        const where = {};

        if (req.query.name) {

            where.name = {
                [Op.like]: `%${req.query.name}%`
            };

        }

        const products = await Product.findAll({

            where,

            include: [

                {
                    model: Category,
                    as: "category"
                },

                {
                    model: Batch,
                    as: "batches"
                }

            ]

        });

        const response = products.map(product => {

            const stock = product.batches.reduce(

                (total, batch) => total + batch.quantity,

                0

            );

            return {

                id: product.id,

                name: product.name,

                minimumStock: product.minimumStock,

                stock,

                category: product.category,

                batches: product.batches.length

            };

        });

        res.json(response);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
GET PRODUCTO
====================================
*/

router.get("/:productId", validateId, async (req, res) => {

    try {

        const product = await Product.findByPk(req.params.productId, {

            include: [

                {
                    model: Category,
                    as: "category"
                },

                {
                    model: Batch,
                    as: "batches",
                    include: [

                        {
                            model: House,
                            as: "house"
                        }

                    ]
                }

            ]

        });

        if (!product) {

            return res.status(404).json({

                message: "Producto no encontrado"

            });

        }

        const stock = product.batches.reduce(

            (total, batch) => total + batch.quantity,

            0

        );

        res.json({

            id: product.id,

            name: product.name,

            minimumStock: product.minimumStock,

            stock,

            category: product.category,

            batches: product.batches

        });

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
CREAR PRODUCTO
====================================
*/

router.post("/", validateProduct, async (req, res) => {

    try {

        const category = await Category.findByPk(req.body.categoryId);

        if (!category) {

            return res.status(404).json({

                message: "Categoría inexistente"

            });

        }

        const product = await Product.create({

            name: req.body.name,

            minimumStock: req.body.minimumStock,

            categoryId: req.body.categoryId

        });

        const created = await Product.findByPk(product.id, {

            include: {

                model: Category,

                as: "category"

            }

        });

        res.status(201).json(created);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
MODIFICAR PRODUCTO
====================================
*/

router.put("/:productId", [...validateId, ...validateProduct], async (req, res) => {

    try {

        const product = await Product.findByPk(req.params.productId);

        if (!product) {

            return res.status(404).json({

                message: "Producto no encontrado"

            });

        }

        await product.update({

            name: req.body.name,

            minimumStock: req.body.minimumStock,

            categoryId: req.body.categoryId

        });

        const updated = await Product.findByPk(product.id, {

            include: {

                model: Category,

                as: "category"

            }

        });

        res.json(updated);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
ELIMINAR PRODUCTO
====================================
*/

router.delete("/:productId", validateId, async (req, res) => {

    try {

        const product = await Product.findByPk(req.params.productId);

        if (!product) {

            return res.status(404).json({

                message: "Producto no encontrado"

            });

        }

        await Batch.destroy({

            where: {

                productId: product.id

            }

        });

        await product.destroy();

        res.status(204).send();

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;