const express = require('express');
const router = express.Router();
const users = require('../models/userSchema');
const carts = require('../models/cartSchema');
const products = require('../models/productSchema');

const DB = 'mongodb://127.0.0.1:27017/duotoons';


//Routes

//Authentication routes
router.post('/register', async (req, res) => {
    const { name, email, phone, nickname, password, cpassword } = req.body;

    if (!name || !email || !phone || !nickname || !password || !cpassword) {
        res.status(404).json('Please fill all the data!');
    }
    else if (password != cpassword) {
        res.status(404).json('Password does not match!');
    }
    else {
        try {
            const preEmail = await users.findOne({ email: email });
            const prePhone = await users.findOne({ phone: phone });

            if (preEmail) res.status(404).json('User with this Email is already present!');
            else if (prePhone) res.status(404).json('User with this Phone Number is already present!');
            else {
                const addUser = new users({ name, email, phone, nickname, password, cpassword });

                await addUser.save();

                res.status(201).json(addUser);
                // console.log(addUser);
            }
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(404).json('Please fill all the data!');
    }
    else {
        try {
            const preEmail = await users.findOne({ email: email });
            if (!preEmail) res.status(404).json('User with this Email does not exist!');
            else if (preEmail.password != password) res.status(404).json('Password is incorrect!');
            else {
                res.status(201).json("Logged In successfully!");
            }
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})





//Site routes
//User side routes
router.get('/getProducts', async (req, res) => {
    const { email } = req.body;

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

router.post('/addToCart', async (req, res) => {
    const { email, product } = req.body;

    if (!email) {
        res.status(404).json('Please login!');
    }
    else {
        try {
            const preEmail = await carts.findOne({ userEmail: email });
            if (preEmail) {
                preEmail.productId.push(product);
                preEmail.save();
                res.status(201).json('Item added successfully!');
            }
            else {
                const addCart = new carts({ productId: [product], userEmail: email });
                await addCart.save();
                res.status(201).json('Item added successfully!');
            }
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/removeFromCart', async (req, res) => {
    const { email, product } = req.body;

    if (!email) {
        res.status(404).json('Please login!');
    }
    else {
        try {
            const addUser = new users({ email, phone, nickname, password, cpassword });
            await addUser.save();
            res.status(201).json('Item removed successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})






//Admin side routes
router.post('/addProduct', async (req, res) => {
    const { email, product, description, price, size, color, image, category, stock } = req.body;

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

router.post('/updateProduct', async (req, res) => {
    const { email, productId, product, description, price, size, color, image, category, stock } = req.body;

    if (email != "admin@gmail.com") {
        res.status(404).json('Only admin can add Products!');
    }
    else {
        try {
            const productToBeEdited = await products.findOne({ _id: productId });
            await products.updateOne({ _id: productToBeEdited._id }, { $set: { 
                product, description, price, size, color, image, category, stock
             } });
            res.status(201).json('Product updated successfully!');
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})

router.post('/deleteProduct', async (req, res) => {
    const { email, productId} = req.body;

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