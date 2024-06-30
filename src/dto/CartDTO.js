class CartDTO {
    constructor({ id, cartId, products, createdAt }) {
        this.id = id;
        this.cartId = cartId;
        this.products = products;
        this.createdAt = createdAt;
    }
}

module.exports = CartDTO;