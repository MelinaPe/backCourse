const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    cartId: {
        type: String,
        required: true,
        unique: true 
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' 
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;