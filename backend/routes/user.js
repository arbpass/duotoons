const express = require('express');
const router = express.Router();
const carts = require('../models/cartSchema');
const orders = require('../models/orderSchema');
const products = require('../models/productSchema');
const auth = require("../middlewares/auth");
const jwt_decode = require("jwt-decode");
const { default: mongoose } = require('mongoose');


//User side routes
router.get('/getProducts/:email?', async (req, res) => {
    const { email } = req.params;

    if (!email) {
        const allProducts = await products.find();
        res.status(201).json(allProducts);
    }
    else {
        const allProducts = await products.find();
        const allCart = await carts.findOne({ userEmail: email });
        res.status(201).json({ allProducts, allCart });
    }
})

router.get('/getProduct/:id?', async (req, res) => {
    const { id } = req.params;

    const allProducts = await products.findOne({ _id: id });
    res.status(201).json(allProducts);
})

router.get('/getProduct/category/:cat?', async (req, res) => {
    const { cat } = req.params;

    const allProducts = await products.find({ category: cat });
    res.status(201).json(allProducts);
})

router.post('/addToCart', auth, async (req, res) => {
    const { product } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (!email) {
        res.status(404).json('Please login!');
    }
    else {
        try {
            const userCart = await carts.findOne({ userEmail: email });
            const productDetails = await products.findOne({ _id: product });

            if (userCart) {
                await userCart.productId.push(product);
                const updatedCost = userCart.totalCost + productDetails.price;
                await carts.updateOne({ _id: userCart._id }, { $set: { totalCost: updatedCost } });
                userCart.save();
                res.status(201).json('Item added successfully!');
            }
            else {
                const addCart = new carts({ productId: [product], userEmail: email, totalCost: productDetails.price });
                await addCart.save();
                res.status(201).json('Item added successfully!');
            }
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/removeFromCart', auth, async (req, res) => {
    const { product } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (!email) {
        res.status(404).json('Please login!');
    }
    else {
        try {
            const productDetails = await products.findOne({ _id: product });
            const userCart = await carts.findOne({ userEmail: email });

            const index = userCart.productId.indexOf(product);
            userCart.productId.splice(index, 1);

            const updatedCost = userCart.totalCost - productDetails.price;
            await carts.updateOne({ _id: userCart._id }, { $set: { totalCost: updatedCost } });
            userCart.save();
            res.status(201).json('Item removed successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/checkout', auth, async (req, res) => {
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

    if (!email) {
        res.status(404).json('Please login!');
    }
    else {
        try {
            const userCart = await carts.findOne({ userEmail: email });
            const addOrder = new orders({ productId: userCart.productId, userEmail: email, totalPrice: userCart.totalCost });
            await carts.deleteOne({ _id: userCart._id });
            await addOrder.save();
            res.status(201).json('Order done successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})


module.exports = router;