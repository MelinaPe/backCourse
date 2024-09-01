const { productRepository } = require('../services/index.js')
const logger = require('../utils/logger').logger; 

class ProductManager {
    async addProduct(product) {
        try {
            console.log("Attempting to add product:", product); 
            const newProduct = await productRepository.createProduct(product);
            logger.info("Product added successfully");
            return newProduct;
        } catch (error) {
            console.error("Error adding product:", error);
            logger.error("Error adding product", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            const products = await productRepository.getProducts();
            logger.info('Products retrieved:', products.length);
            return products;
        } catch (error) {
            console.log("Error getting products", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await productRepository.getProductById(id);
        } catch (error) {
            logger.error("Error getting product by ID", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await productRepository.updateProduct(id, updatedFields);
            logger.info("Product updated successfully");
            return updatedProduct;
        } catch (error) {
            logger.error("Error updating product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productRepository.deleteProduct(id);
            logger.info("Product removed successfully");
            return deletedProduct;
        } catch (error) {
            logger.error("Error deleting product", error);
            throw error;
        }
    }

    async countDocuments(filter) {
        try {
            return await productRepository.countDocuments(filter);
        } catch (error) {
            logger.error("Error counting documents", error);
            throw error;
        }
    }
}

module.exports = ProductManager;