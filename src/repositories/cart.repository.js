const MongooseCartDAO = require("../dao/MongooseCartDAO");
const CartDTO = require("../dto/CartDTO");

class CartRepository {
    constructor() {
        this.dao = new MongooseCartDAO();
    }

    async createCart() {
        const cart = await this.dao.addCart();
        return new CartDTO(cart);
    }

    async getCartById(id) {
        const cart = await this.dao.getCartById(id);
        return new CartDTO(cart);
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.dao.addProductToCart(cartId, productId, quantity);
        return new CartDTO(cart);
    }
}

module.exports = CartRepository;
