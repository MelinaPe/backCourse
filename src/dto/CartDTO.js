class CartDTO {
    constructor({ _id, cartId, products, createdAt }) {
        this._id = _id; 
        this.cartId = cartId || _id;
        this.products = products;
        this.createdAt = createdAt;
    }
}

module.exports = CartDTO;