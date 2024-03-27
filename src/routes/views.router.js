const express = require('express');
const router = express.Router(); 
const ProductManager = require("../controllers/productManager.js"); 
const productManager = new ProductManager("./src/models/products.json"); 

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.render("home", {products:products}); 
    } catch (error) {
        res.status(500).json({error: "Server internal error"})
    }
}); 

router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts"); 
    } catch(error) {
        res.status(500).json({error: "Server internal error"})
    }
}); 

module.exports = router; 