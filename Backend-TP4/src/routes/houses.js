const express = require("express");
const { House, User, Batch, Product, Category } = require("../models");

const router = express.Router();

/*
=========================================
OBTENER CASAS DE UN USUARIO
GET /api/houses/user/:id
=========================================
*/

router.get("/user/:id", async (req, res) => {

    try {

        const user = await User.findByPk(req.params.id, {

            include: [
                {
                    model: House,
                    as: "houses"
                }
            ]

        });

        if (!user) {

            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }
        res.json(user.houses);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


/*
=========================================
OBTENER PRODUCTOS DE UNA CASA
GET /api/houses/:houseId/products
=========================================
*/

router.get("/:houseId/products", async (req, res) => {

    try {

        const house = await House.findByPk(req.params.houseId);

        if (!house) {

            return res.status(404).json({
                message: "Casa no encontrada"
            });

        }

        const batches = await Batch.findAll({

            where: {
                houseId: req.params.houseId
            },

            include: [
                {
                    model: Product,
                    as: "product",
                    include: [
                        {
                            model: Category,
                            as: "category"
                        }
                    ]
                }
            ]

        });

        const products = {};

        batches.forEach(batch => {

            const product = batch.product;

            if (!products[product.id]) {

                products[product.id] = {

                    id: product.id,
                    name: product.name,
                    minimumStock: product.minimumStock,

                    stock: 0,

                    batches: 0,

                    category: product.category

                };

            }

            products[product.id].stock += batch.quantity;

            products[product.id].batches++;

        });

        res.json(Object.values(products));

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


/*
=========================================
OBTENER CATEGORÍAS DE UNA CASA
GET /api/houses/:houseId/categories
=========================================
*/

router.get("/:houseId/categories", async (req, res) => {

    try {

        const batches = await Batch.findAll({

            where: {
                houseId: req.params.houseId
            },

            include: [
                {
                    model: Product,
                    as: "product",
                    include: [
                        {
                            model: Category,
                            as: "category"
                        }
                    ]
                }
            ]

        });

        const categories = {};

        batches.forEach(batch => {

            const category = batch.product.category;

            if (!category) {
                return;
            }

            if (!categories[category.id]) {

                categories[category.id] = {

                    id: category.id,
                    name: category.name,
                    products: new Set()

                };

            }

            categories[category.id].products.add(batch.product.id);

        });

        const result = Object.values(categories).map(category => ({

            id: category.id,

            name: category.name,

            productsCount: category.products.size

        }));

        res.json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;