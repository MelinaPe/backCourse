const express = require("express"); 
const router = express.Router(); 
const CartManager = require("../controllers/cartManager.js");
const cartManager = new CartManager("./src/models/carts.json");

// Routes

router.post("/carts", async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ status: "success", data: newCart });
    } catch (error) {
        console.error("Error creating cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await cartManager.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json({ status: "success", data: cart.products });
    } catch (error) {
        console.error("Error getting products in cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


router.post("/carts/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        const { quantity } = req.body;
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json({ status: "success", data: updatedCart });
    } catch (error) {
        console.error("Error adding product to cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


module.exports = router; 