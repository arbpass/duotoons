const express = require('express');
const router = express.Router();
const users = require('../models/userSchema');
const carts = require('../models/cartSchema');
const products = require('../models/productSchema');
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const jwt_decode = require("jwt-decode");
const bcrypt = require("bcryptjs");


//Routes

//Authentication routes
router.post('/register', async (req, res) => {
    const { name, email, phone, nickname, pass, cpass } = req.body;

    if (!name || !email || !phone || !nickname || !pass || !cpass) {
        res.status(404).json('Please fill all the data!');
    }
    else if (pass != cpass) {
        res.status(404).json('Password does not match!');
    }
    else {
        try {
            const preEmail = await users.findOne({ email: email });
            const prePhone = await users.findOne({ phone: phone });

            if (preEmail) res.status(404).json('User with this Email is already present!');
            else if (prePhone) res.status(404).json('User with this Phone Number is already present!');
            else {
                const password = await bcrypt.hash(pass, 10);
                const cpassword = await bcrypt.hash(cpass, 10);
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
                // Create token
                const token = jwt.sign(
                    { email }, process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                res.status(201).json(token);
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

router.post('/addToCart', auth, async (req, res) => {
    const { product } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;
    
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

router.post('/removeFromCart', auth, async (req, res) => {
    const { product } = req.body;
    const token = req.header('x-access-token');
    const email = jwt_decode(token).email;

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