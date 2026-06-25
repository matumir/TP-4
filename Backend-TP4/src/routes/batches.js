const express = require("express");
const { body, validationResult } = require("express-validator");

const {
    Batch,
    Product,
    House,
    Category
} = require("../models");

const router = express.Router();

/*
====================================
VALIDACIÓN
====================================
*/

const validateBatch = [

    body("productId")
        .isInt({ gt: 0 }),

    body("houseId")
        .isInt({ gt: 0 }),

    body("quantity")
        .isInt({ min: 0 }),

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
TODOS LOS LOTES
====================================
*/

router.get("/", async (req, res) => {

    try {

        const batches = await Batch.findAll({

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
                },

                {
                    model: House,
                    as: "house"
                }

            ]

        });

        res.json(batches);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
LOTES DE UN PRODUCTO EN UNA CASA
GET /api/batches/product/:productId/house/:houseId
====================================
*/

router.get("/product/:productId/house/:houseId", async (req, res) => {

    try {

        const batches = await Batch.findAll({

            where: {

                productId: req.params.productId,
                houseId: req.params.houseId

            },

            order: [

                ["expirationDate", "ASC"]

            ]

        });

        res.json(batches);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
UN LOTE
====================================
*/

router.get("/:batchId", async (req, res) => {

    try {

        const batch = await Batch.findByPk(req.params.batchId, {

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

        });

        if (!batch) {

            return res.status(404).json({

                message: "Lote no encontrado"

            });

        }

        res.json(batch);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
CREAR LOTE
====================================
*/

router.post("/", validateBatch, async (req, res) => {

    try {

        const {

            productId,
            houseId,
            quantity,
            expirationDate

        } = req.body;

        const existing = await Batch.findOne({

            where: {

                productId,
                houseId,
                expirationDate

            }

        });

        if (existing) {

            existing.quantity += quantity;

            await existing.save();

            return res.json(existing);

        }

        const batch = await Batch.create({

            productId,
            houseId,
            quantity,
            expirationDate

        });

        res.status(201).json(batch);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
ACTUALIZAR LOTE
====================================
*/

router.put("/:batchId", async (req, res) => {

    try {

        const batch = await Batch.findByPk(req.params.batchId);

        if (!batch) {

            return res.status(404).json({

                message: "Lote no encontrado"

            });

        }

        await batch.update({

            quantity: req.body.quantity,
            expirationDate: req.body.expirationDate

        });

        res.json(batch);

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

/*
====================================
ELIMINAR LOTE
====================================
*/

router.delete("/:batchId", async (req, res) => {

    try {

        const batch = await Batch.findByPk(req.params.batchId);

        if (!batch) {

            return res.status(404).json({

                message: "Lote no encontrado"

            });

        }

        await batch.destroy();

        res.status(204).send();

    }

    catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;