const MongooseProductDAO = require('../dao/MongooseProductDAO');
const ProductDTO = require('../dto/ProductDTO');

class ProductRepository {
    constructor() {
        this.dao = new MongooseProductDAO();
    }

    async createProduct(dataProduct) {
        const product = await this.dao.addProduct(dataProduct);
        return new ProductDTO(product);
    }

    async getProducts(filter = {}, options = {}) {
        const products = await this.dao.getProducts(filter, options);
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await this.dao.getProductById(id);
        return new ProductDTO(product);
    }

    async updateProduct(id, updateData) {
        const product = await this.dao.updateProduct(id, updateData);
        return new ProductDTO(product);
    }

    async deleteProduct(id) {
        const product = await this.dao.deleteProduct(id);
        return new ProductDTO(product);
    }

    async countDocuments(filter) {
        return await this.dao.countDocuments(filter);
    }
}

module.exports = ProductRepository;

