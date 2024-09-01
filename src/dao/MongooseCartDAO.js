const ICartDAO = require('./ICartDAO');
const Cart = require('../models/cart');
const ProductModel = require('../models/products'); 
const mongoose = require('mongoose');

class MongooseCartDAO extends ICartDAO {
    async addCart() {
        const newCart = new Cart({ products: [], cartId: new mongoose.Types.ObjectId() });
        await newCart.save();
        return newCart;
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate('products');
        return cart;
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found');

        const product = await ProductModel.findById(productId);
        if (!product) throw new Error('Product not found');

        const productInCart = cart.products.find(p => p._id.equals(productId));
        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ _id: product._id, quantity });
        }
        await cart.save();
        return cart;
    }
}

module.exports = MongooseCartDAO;
