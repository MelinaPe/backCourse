const Cart = require('../models/cart');
const ProductModel = require('../models/products');
const { cartRepository } = require('../services');

class CartManager {
    async addCart() {
        try {
            const newCart = await cartRepository.createCart();
            console.log("Cart added successfully");
            return newCart;
        } catch (error) {
            console.error("Error adding cart", error);
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await cartRepository.getCartById(cartId);
            if (!cart) {
                console.log("Cart not found.");
                return null;
            }
            return cart;
        } catch (error) {
            console.error("Error retrieving the cart:", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await Cart.findById(cartId).populate('products.product');
            if (!cart) {
                console.log("Cart not found.");
                return;
            }

            const existingProduct = cart.products.find(item => item.product._id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                const product = await ProductModel.findById(productId);
                if (!product) {
                    console.log("Product not found.");
                    return;
                }
                cart.products.push({ product: product._id, quantity });
            }

            await cart.save();
            console.log("Product added to cart successfully");
            return cart;
        } catch (error) {
            console.error("Error adding product to cart:", error);
            throw error;
        }
    }

}

module.exports = CartManager;

