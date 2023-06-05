const express = require('express');
const router = express.Router();
const products = require('../models/productSchema');
const auth = require("../middlewares/auth");
const jwt_decode = require("jwt-decode");
const { default: mongoose } = require('mongoose');


//Admin side routes
router.post('/addProduct', auth, async (req, res) => {
    const { product, description, price, size, color, image, category, stock } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (email != "admin@gmail.com") {
        res.status(404).json('Only admin can add Products!');
    }
    else {
        try {
            const addProduct = new products({ product, description, price, size, color, image, category, stock });
            await addProduct.save();
            res.status(201).json('Product added successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/updateProduct', auth, async (req, res) => {
    const { productId, product, description, price, size, color, image, category, stock } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (email != "admin@gmail.com") {
        res.status(404).json('Only admin can add Products!');
    }
    else {
        try {
            const productToBeEdited = await products.findOne({ _id: productId });
            await products.updateOne({ _id: productToBeEdited._id }, {
                $set: {
                    product, description, price, size, color, image, category, stock
                }
            });
            res.status(201).json('Product updated successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/deleteProduct', auth, async (req, res) => {
    const { productId } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (email != "admin@gmail.com") {
        res.status(404).json('Only admin can add Products!');
    }
    else {
        try {
            const productToBeDeleted = await products.findOne({ _id: productId });
            await products.deleteOne({ _id: productToBeDeleted._id });
            res.status(201).json('Product deleted successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})


module.exports = router;