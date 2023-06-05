const mongoose= require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: {
        type: Array,
        required: false,
    },
    userEmail: {
        type: String,
        required: true,
    },
})


const carts = new mongoose.model('carts', cartSchema);

module.exports = carts;