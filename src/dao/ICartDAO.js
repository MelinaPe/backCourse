class ICartDAO {
    async addCart() {
        throw new Error('Method not implemented');
    }

    async getCartById(cartId) {
        throw new Error('Method not implemented');
    }

    async addProductToCart(cartId, productId, quantity) {
        throw new Error('Method not implemented');
    }
}

module.exports = ICartDAO;
