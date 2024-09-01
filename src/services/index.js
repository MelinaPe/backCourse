const ProductRepository = require('../repositories/product.repository.js');
const CartRepository = require('../repositories/cart.repository.js'); 
const productRepository = new ProductRepository();
const cartRepository = new CartRepository(); 

module.exports = {
    productRepository, 
    cartRepository
};