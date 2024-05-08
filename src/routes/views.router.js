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


router.get("/products", async (req, res) => {
    try {
        if (!req.session.login) {
            return res.redirect("/login"); 
        }
        res.render("products", { 
            user: req.session.user 
        }); 
    } catch(error) {
        res.status(500).json({ error: "Server internal error" })
    }
}); 


router.get("/login", (req, res) => {
    res.render("login"); 
})


router.get("/register", (req, res) => {
    res.render("register"); 
})

router.get("/profile", (req, res) => {
    if(!req.session.login) {
        return res.redirect("/login")
    } 
    res.render("profile"); 
})


module.exports = router; 