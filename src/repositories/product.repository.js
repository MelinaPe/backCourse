
// const ProductModel = require("../models/products.js");

// class ProductRepository {
//     async createProduct(dataProduct) {
//         try {
//             const product = new ProductModel(dataProduct);
//             return await product.save();
//         } catch (error) {
//             throw new Error("Error creating product");
//         }
//     }

//     async getProduct(filter = {}, options = {}) {
//         try {
//             return await ProductModel.find(filter, null, options);
//         } catch (error) {
//             throw new Error("Error getting products");
//         }
//     }

//     async getProductById(id) {
//         try {
//             return await ProductModel.findById(id);
//         } catch (error) {
//             throw new Error("Error getting product by ID");
//         }
//     }

//     async updateProduct(id, updateData) {
//         try {
//             return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
//         } catch (error) {
//             throw new Error("Error updating product");
//         }
//     }

//     async deleteProduct(id) {
//         try {
//             return await ProductModel.findByIdAndDelete(id);
//         } catch (error) {
//             throw new Error("Error deleting product");
//         }
//     }

//     async countDocuments(filter) {
//         try {
//             return await ProductModel.countDocuments(filter);
//         } catch (error) {
//             throw new Error("Error counting documents");
//         }
//     }
// }

// module.exports = ProductRepository;



// TESTING DAO 

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

