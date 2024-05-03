const mongoose = require('mongoose');
const ProductModel = require('./products'); 

const cartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;