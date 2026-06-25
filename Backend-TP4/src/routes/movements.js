const express = require("express");
const { body, validationResult } = require("express-validator");

const {
    Movement,
    Batch,
    Product,
    House
} = require("../models");

const router = express.Router();

/*
====================================
VALIDACIÓN
====================================
*/

const validateMovement = [

    body("type")
        .isIn(["ENTRY", "EXIT"]),

    body("quantity")
        .isInt({ gt: 0 }),

    body("productId")
        .isInt({ gt: 0 }),

    body("houseId")
        .isInt({ gt: 0 }),

    body("expirationDate")
        .isISO8601(),

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
LISTAR MOVIMIENTOS
====================================
*/

router.get("/", async (req, res) => {

    try {

        const movements = await Movement.findAll({

            order: [["createdAt", "DESC"]],

            include: [

                {

                    model: Batch,

                    as: "batch",

                    include: [

                        {
                            model: Product,
                            as: "product"
                        },

                        {
                            model: House,
                            as: "house"
                        }

                    ]

                }

            ]

        });

        res.json(movements);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
REGISTRAR MOVIMIENTO
====================================
*/

router.post("/", validateMovement, async (req, res) => {

    try {

        const {

            type,
            quantity,
            productId,
            houseId,
            expirationDate

        } = req.body;

        const product = await Product.findByPk(productId);

        if (!product) {

            return res.status(404).json({
                message: "Producto no encontrado"
            });

        }

        const house = await House.findByPk(houseId);

        if (!house) {

            return res.status(404).json({
                message: "Casa no encontrada"
            });

        }

        let batch = await Batch.findOne({

            where: {

                productId,
                houseId,
                expirationDate

            }

        });

        if (type === "ENTRY") {

            if (!batch) {

                batch = await Batch.create({

                    productId,
                    houseId,
                    expirationDate,
                    quantity: 0

                });

            }

            batch.quantity += quantity;

            await batch.save();

        }

        if (type === "EXIT") {

            if (!batch) {

                return res.status(404).json({

                    message: "No existe un lote con esa fecha de vencimiento."

                });

            }

            if (batch.quantity < quantity) {

                return res.status(400).json({

                    message: "Stock insuficiente en ese lote."

                });

            }

            batch.quantity -= quantity;

            await batch.save();

            if (batch.quantity === 0) {

                await batch.destroy();

            }

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

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;