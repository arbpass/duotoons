const mongoose= require('mongoose');

const orderSchema = new mongoose.Schema({
    productId: {
        type: Array,
        required: false,
    },
    userEmail: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderTime: {
        type: Date,
        default: Date.now
    }
})


const orders = new mongoose.model('orders', orderSchema);

module.exports = orders;