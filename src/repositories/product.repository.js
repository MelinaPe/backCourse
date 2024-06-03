
const ProductModel = require("../models/products.js");

class ProductRepository {
    async createProduct(dataProduct) {
        try {
            const product = new ProductModel(dataProduct);
            return await product.save();
        } catch (error) {
            throw new Error("Error creating product");
        }
    }

    async getProduct(filter = {}, options = {}) {
        try {
            return await ProductModel.find(filter, null, options);
        } catch (error) {
            throw new Error("Error getting products");
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            throw new Error("Error getting product by ID");
        }
    }

    async updateProduct(id, updateData) {
        try {
            return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error("Error updating product");
        }
    }

    async deleteProduct(id) {
        try {
            return await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Error deleting product");
        }
    }

    async countDocuments(filter) {
        try {
            return await ProductModel.countDocuments(filter);
        } catch (error) {
            throw new Error("Error counting documents");
        }
    }
}

module.exports = ProductRepository;