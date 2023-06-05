const mongoose= require('mongoose');

const productSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    stock: {
        type: Boolean,
        required: true,
    },
})


const products = new mongoose.model('products', productSchema);

module.exports = products;