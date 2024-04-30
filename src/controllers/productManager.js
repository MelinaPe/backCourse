const ProductModel = require("../models/products")

class ProductManager {
    async addProduct(product) {
        try {
            const newProduct = new ProductModel(product);
            await newProduct.save();
            console.log("Product added successfully");
            return newProduct;
        } catch (error) {
            console.error("Error adding product", error);
            throw error;
        }
    }

    async getProducts() {
        try {
            return await ProductModel.find();
        } catch (error) {
            console.error("Error getting products", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await ProductModel.findById(id);
        } catch (error) {
            console.error("Error getting product by ID", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
            console.log("Product updated successfully");
            return updatedProduct;
        } catch (error) {
            console.error("Error updating product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            console.log("Product removed successfully");
            return deletedProduct;
        } catch (error) {
            console.error("Error deleting product", error);
            throw error;
        }
    }
}

module.exports = ProductManager;


