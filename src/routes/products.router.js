const express = require("express"); 
const router = express.Router(); 
const ProductManager = require("../controllers/productManager.js")
const productManager = new ProductManager("./src/models/products.json")

// Routes 

router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit; 
        const products = await productManager.getProducts(); 
        if (limit) {
            res.json(products.slice(0, limit)); 
        } else {
            res.json(products); 
        }
    } catch (error) {
        console.error("Error getting products", error); 
        res.status(500).json({error: "Server internal error"}); 
    }
})


router.get("/products/:pid", async (req, res) => {
    const id = req.params.pid; 

    try {
        const product = await productManager.getProductById(id); 

        if (!product){
            return res.json({error: "Product not found"})
        }
        res.json(product); 
    } catch (error) {
        console.error("Error getting product", error)
        res.status(500).json({error: "Server internal error"}); 
    }
})


router.post("/products", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, category } = req.body;
        await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
        res.status(201).json({ status: "success", message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

router.put("/products/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedFields = req.body;

    try {
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (updatedFields.hasOwnProperty('id')) {
            delete updatedFields.id;
        }

        Object.assign(product, updatedFields);

        await productManager.updateProduct(id, product);

        res.json({ status: "success", message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


router.delete("/products/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        res.json({ status: "success", message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


module.exports = router;

