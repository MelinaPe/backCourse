// const IProductDAO = require('./IProductDAO');
// const ProductModel = require('../models/products');

// class MongooseProductDAO extends IProductDAO {
//     async addProduct(product) {
//         const newProduct = new ProductModel(product);
//         await newProduct.save();
//         return newProduct;
//     }

//     async getProducts() {
//         return await ProductModel.find();
//     }

//     async getProductById(id) {
//         return await ProductModel.findById(id);
//     }

//     async updateProduct(id, updatedFields) {
//         return await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
//     }

//     async deleteProduct(id) {
//         return await ProductModel.findByIdAndDelete(id);
//     }
// }

// module.exports = MongooseProductDAO;


const IProductDAO = require('./IProductDAO');
const ProductModel = require('../models/products');
const ProductDTO = require('../dto/ProductDTO'); 

class MongooseProductDAO extends IProductDAO {
    async addProduct(product) {
        const newProduct = new ProductModel(product);
        await newProduct.save();
        return new ProductDTO(newProduct);
    }

    async getProducts() {
        const products = await ProductModel.find();
        console.log('Retrieved products from DB:', products.length);
        return products.map(product => new ProductDTO(product));
    }

    async getProductById(id) {
        const product = await ProductModel.findById(id);
        return new ProductDTO(product);
    }

    async updateProduct(id, updatedFields) {
        const product = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
        return new ProductDTO(product);
    }

    async deleteProduct(id) {
        const product = await ProductModel.findByIdAndDelete(id);
        return new ProductDTO(product);
    }

    async countDocuments(filter) {
        return await ProductModel.countDocuments(filter);
    }
}

module.exports = MongooseProductDAO;