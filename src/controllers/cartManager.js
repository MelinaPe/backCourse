const fs = require("fs");
const fsPromises = require("fs").promises;

class CartManager {
    constructor() {
        this.cartPath = "./src/models/carts.json";
        this.productPath = "./src/models/products.json";
    }

    async addCart() {
        try {
            const data = await fsPromises.readFile(this.cartPath, "utf-8");
            const existingCarts = JSON.parse(data);

            const cartId = existingCarts.length > 0 ? Math.max(...existingCarts.map(cart => cart.id)) + 1 : 1;

            const newCart = { id: cartId, products: [] };

            existingCarts.push(newCart);

            await fsPromises.writeFile(this.cartPath, JSON.stringify(existingCarts, null, 2));
            console.log("Cart added successfully");
        } catch (error) {
            console.error("Error adding cart", error);
        }
    }

    async getCartById(cartId) {
        try {
            const data = await fsPromises.readFile(this.cartPath, "utf-8");
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id === parseInt(cartId));
            if (!cart) {
                console.log("Cart not found.");
            } else {
                console.log(cart);
                return cart;
            }
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cartData = await fsPromises.readFile(this.cartPath, "utf-8");
            const carts = JSON.parse(cartData);
            const productData = await fsPromises.readFile(this.productPath, "utf-8");
            const products = JSON.parse(productData);
    
            const cartIndex = carts.findIndex(cart => cart.id === parseInt(cartId));
            const productIndex = products.findIndex(product => product.id === parseInt(productId));
    
            if (cartIndex === -1) {
                console.log("Cart not found.");
                return;
            }
    
            if (productIndex === -1) {
                console.log("Product not found.");
                return;
            }
    
            const existingProduct = carts[cartIndex].products.find(item => item.id === parseInt(productId));

    
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                carts[cartIndex].products.push({ id: parseInt(productId), quantity });
            }
    
            await fsPromises.writeFile(this.cartPath, JSON.stringify(carts, null, 2));
            console.log("Product added to cart successfully");
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }
}
    

module.exports = CartManager;
