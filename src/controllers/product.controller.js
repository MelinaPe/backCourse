const mongoose = require("mongoose"); 
const productService = require("../services/index.js");
const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();
const errorDictionary = require("../utils/errors.js"); 
const { sendEmail } = require("../services/emailService"); 
const ProductModel = require("../models/products.js"); 
const Cart = require("../models/cart.js"); 
const UserModel = require("../models/user.model.js")

class ProductController {

    async createProduct(req, res, next) {
        const newProduct = req.body;
        console.log("Received product data:", newProduct);
        try {
            let product = await productManager.addProduct(newProduct);
            res.json(product);
        } catch (error) {
            next(errorDictionary.INVALID_INPUT);
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            page = parseInt(page);
            limit = parseInt(limit);

            const offset = (page - 1) * limit;

            const options = {
                limit: limit,
                skip: offset,
                sort: {}
            };

            if (sort) {
                options.sort.price = sort === 'asc' ? 1 : -1;
            }

            const filter = {};
            if (query) {
                filter.category = query;
            }

            const products = await productManager.getProducts(filter, options);
            console.log('Products sent to client:', products.length); 
            console.log("Cart ID in session:", req.session.user?.cartId);
            const totalCount = await productManager.countDocuments(filter);

            const totalPages = Math.ceil(totalCount / limit);
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            const prevLink = prevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
            const nextLink = nextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

            const cartId = req.session.user?.cartId || null;

            res.json({
                status: "success",
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                hasPrevPage: prevPage !== null,
                hasNextPage: nextPage !== null,
                prevLink,
                nextLink, 
                cartId
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res, next) {
        try {
            const product = await productManager.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            next(errorDictionary.PRODUCT_NOT_FOUND);
        }
    }

    async updateProduct(req, res) {
        try {
            const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            const product = await ProductModel.findById(productId);
    
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }
    
            const cartsContainingProduct = await Cart.find({ 'products.product': productId });
    
            for (const cart of cartsContainingProduct) {
                cart.products = cart.products.filter(item => item.product.toString() !== productId);
                await cart.save();
    
                const user = await UserModel.findById(cart.userId);
                if (user) {
                    await sendEmail(
                        user.email,
                        'Product Removed from Cart',
                        `The product "${product.title}" has been removed from your cart because it is no longer available.`
                    );
                }
            }
    
            await ProductModel.findByIdAndDelete(productId);
    
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = ProductController;
