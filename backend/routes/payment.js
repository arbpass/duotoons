const express = require('express');
const router = express.Router();
const carts = require('../models/cartSchema');

const Razorpay = require("razorpay");
const instance = new Razorpay({
    key_id: 'rzp_test_1fTjSvIIgBkt6M',
    key_secret: 'R2CDK8zeMTezejzP0yPNyjZh',
});


router.get("/order/:totalCost", (req, res) => {
    try {
        const options = {
            amount: req.params.totalCost * 100, // amount == Rs 10
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: 0,
            // 1 for automatic capture // 0 for manual capture
        };
        instance.orders.create(options, async function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: "Something Went Wrong",
                });
            }
            return res.status(200).json(order);
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});


router.post("/capture/:paymentId/:email/:totalCost", async (req, res) => {
    await carts.deleteOne({ userEmail: req.params.email });

    try {
        return request(
            {
                method: "POST",
                url: `https://rzp_test_1fTjSvIIgBkt6M:R2CDK8zeMTezejzP0yPNyjZh@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
                form: {
                    amount: req.params.totalCost * 100, // amount == Rs 10 // Same As Order amount
                    currency: "INR",
                },
            },
            async function (err, response, body) {
                if (err) {
                    return res.status(500).json({
                        message: "Something Went Wrong",
                    });
                }
                console.log("Status:", response.statusCode);
                console.log("Headers:", JSON.stringify(response.headers));
                console.log("Response:", body);
                return res.status(200).json(body);
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
        });
    }
});

module.exports = router;