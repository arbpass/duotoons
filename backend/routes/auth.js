const express = require('express');
const router = express.Router();
const users = require('../models/userSchema');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { default: mongoose } = require('mongoose');


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
            else if (!bcrypt.compare(preEmail.password, password)) res.status(404).json('Password is incorrect!');
            else {
                // Create token
                const token = jwt.sign(
                    { email }, process.env.TOKEN_KEY,
                    {
                        expiresIn: "2h",
                    }
                );
                res.status(201).json({token});
            }
        } catch (error) {
            res.status(404).json('Something went wrong : ' + error);
        }
    }
})


module.exports = router;