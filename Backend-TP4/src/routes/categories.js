const express = require("express");
const { body, validationResult } = require("express-validator");

const {
    Category,
    Product,
    Batch
} = require("../models");

const router = express.Router();

/*
====================================
VALIDACIÓN
====================================
*/

const validateCategory = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio"),

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
LISTAR CATEGORÍAS
====================================
*/

router.get("/", async (req, res) => {

    try {

        const categories = await Category.findAll({

            include: [

                {
                    model: Product,
                    as: "products",

                    include: [
                        {
                            model: Batch,
                            as: "batches"
                        }
                    ]
                }

            ]

        });

        const response = categories.map(category => ({

            id: category.id,

            name: category.name,

            productsCount: category.products.length

        }));

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
OBTENER CATEGORÍA
====================================
*/

router.get("/:categoryId", async (req, res) => {

    try {

        const category = await Category.findByPk(req.params.categoryId, {

            include: [

                {
                    model: Product,
                    as: "products",

                    include: [

                        {
                            model: Batch,
                            as: "batches"
                        }

                    ]

                }

            ]

        });

        if (!category) {

            return res.status(404).json({

                message: "Categoría no encontrada"

            });

        }

        const products = category.products.map(product => ({

            id: product.id,

            name: product.name,

            minimumStock: product.minimumStock,

            stock: product.batches.reduce(

                (sum, batch) => sum + batch.quantity,

                0

            )

        }));

        res.json({

            id: category.id,

            name: category.name,

            products

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
CREAR
====================================
*/

router.post("/", validateCategory, async (req, res) => {

    try {

        const category = await Category.create({

            name: req.body.name

        });

        res.status(201).json(category);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
MODIFICAR
====================================
*/

router.put("/:categoryId", validateCategory, async (req, res) => {

    try {

        const category = await Category.findByPk(req.params.categoryId);

        if (!category) {

            return res.status(404).json({

                message: "Categoría no encontrada"

            });

        }

        await category.update({

            name: req.body.name

        });

        res.json(category);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
ELIMINAR
====================================
*/

router.delete("/:categoryId", async (req, res) => {

    try {

        const category = await Category.findByPk(req.params.categoryId);

        if (!category) {

            return res.status(404).json({

                message: "Categoría no encontrada"

            });

        }

        await category.destroy();

        res.status(204).send();

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;