const productService = require("../services/index.js");

// class ProductController {

//     async createProduct(req, res) {
//         const newProduct = req.body;
//         try {
//             let product = await productService.createProduct(newProduct);
//             res.json(product);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     async getProducts(req, res) {
//         try {
//             let { limit = 10, page = 1, sort, query } = req.query;

//             page = parseInt(page);
//             limit = parseInt(limit);

//             const offset = (page - 1) * limit;

//             const options = {};

//             options.limit = limit;
//             options.skip = offset;

//             if (sort) {
//                 options.sort = { price: sort === 'asc' ? 1 : -1 };
//             }

//             const filter = {};
//             if (query) {
//                 filter.category = query;
//             }

//             const products = await productService.getProduct(filter, options);
//             const totalCount = await productService.countDocuments(filter);

//             const totalPages = Math.ceil(totalCount / limit);
//             const prevPage = page > 1 ? page - 1 : null;
//             const nextPage = page < totalPages ? page + 1 : null;
//             const prevLink = prevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
//             const nextLink = nextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

//             res.json({
//                 status: "success",
//                 payload: products,
//                 totalPages,
//                 prevPage,
//                 nextPage,
//                 hasPrevPage: prevPage !== null,
//                 hasNextPage: nextPage !== null,
//                 prevLink,
//                 nextLink
//             });
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     async getProductById(req, res) {
//         try {
//             const product = await productService.getProductById(req.params.id);
//             if (!product) {
//                 return res.status(404).json({ error: 'Product not found' });
//             }
//             res.json(product);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     async updateProduct(req, res) {
//         try {
//             const updatedProduct = await productService.updateProduct(req.params.id, req.body);
//             if (!updatedProduct) {
//                 return res.status(404).json({ error: 'Product not found' });
//             }
//             res.json(updatedProduct);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }

//     async deleteProduct(req, res) {
//         try {
//             const deletedProduct = await productService.deleteProduct(req.params.id);
//             if (!deletedProduct) {
//                 return res.status(404).json({ error: 'Product not found' });
//             }
//             res.json(deletedProduct);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// }

// module.exports = ProductController;


// TESTING DAO 


const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();
const errorDictionary = require("../utils/errors.js"); 


class ProductController {

    async createProduct(req, res, next) {
        const newProduct = req.body;
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
            const totalCount = await productManager.countDocuments(filter);

            const totalPages = Math.ceil(totalCount / limit);
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            const prevLink = prevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
            const nextLink = nextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

            res.json({
                status: "success",
                payload: products,
                totalPages,
                prevPage,
                nextPage,
                hasPrevPage: prevPage !== null,
                hasNextPage: nextPage !== null,
                prevLink,
                nextLink
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
            const deletedProduct = await productManager.deleteProduct(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(deletedProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;
