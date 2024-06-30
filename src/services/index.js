// const ProductRepository = require("../repositories/product.repository.js"); 
// const productService = new ProductRepository(); 

// module.exports = productService; 

// TESTING DAO 

// const MongooseProductDAO = require('../dao/MongooseProductDAO');
// const MongooseCartDAO = require('../dao/MongooseCartDAO');

// const productDAO = new MongooseProductDAO();
// const cartDAO = new MongooseCartDAO();

// module.exports = {
//     productDAO,
//     cartDAO
// };

// DAO 2 

const ProductRepository = require('../repositories/product.repository.js');
const CartRepository = require('../repositories/cart.repository.js'); 
const productRepository = new ProductRepository();
const cartRepository = new CartRepository(); 

module.exports = {
    productRepository, 
    cartRepository
};