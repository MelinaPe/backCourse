const express = require('express');
const router = express.Router();
const ProductManager = require('../controllers/productManager.js');
const ProductModel = require('../models/products');

const productManager = new ProductManager();

// THIS IS WORKING OKI 
// GET all products
// router.get("/", async (req, res) => {
//     try {
//         const products = await productManager.getProducts();
//         res.json(products);
//     } catch (error) {
//         console.error("Error getting products:", error);
//         res.status(500).json({ error: "Server internal error" });
//     }
// });


// GET all products
router.get("/", async (req, res) => {
    try {
        let { limit = 10, page = 1, sort, query } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const offset = (page - 1) * limit;

        const options = {};

        options.limit = limit;
        options.skip = offset;

        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const filter = {};
        if (query) {
            filter.category = query;
        }
        console.log("Filter:", filter);

        const products = await ProductModel.find(filter, null, options);

        const totalCount = await ProductModel.countDocuments(filter);

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
        console.error("Error getting products:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error getting product by ID', error);
        res.status(500).json({ error: 'Server internal error' });
    }
});

// POST a new product
router.post('/', async (req, res) => {
    try {
        const newProduct = new ProductModel(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product', error);
        res.status(500).json({ error: 'Server internal error' });
    }
});

// DELETE product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(deletedProduct);
    } catch (error) {
        console.error('Error deleting product', error);
        res.status(500).json({ error: 'Server internal error' });
    }
});

// PUT update a product by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product', error);
        res.status(500).json({ error: 'Server internal error' });
    }
});

module.exports = router;
