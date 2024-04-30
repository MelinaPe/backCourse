// const express = require("express"); 
// const router = express.Router(); 
// const CartManager = require("../controllers/cartManager.js");
// const cartManager = new CartManager("./src/models/carts.json");

// // Routes

// router.post("/carts", async (req, res) => {
//     try {
//         const newCart = await cartManager.addCart();
//         res.status(201).json({ status: "success", data: newCart });
//     } catch (error) {
//         console.error("Error creating cart", error);
//         res.status(500).json({ error: "Server internal error" });
//     }
// });


// router.get("/carts/:cid", async (req, res) => {
//     const cartId = req.params.cid;
//     try {
//         const cart = await cartManager.getCartById(cartId);
//         if (!cart) {
//             return res.status(404).json({ error: "Cart not found" });
//         }
//         res.json({ status: "success", data: cart.products });
//     } catch (error) {
//         console.error("Error getting products in cart", error);
//         res.status(500).json({ error: "Server internal error" });
//     }
// });


// router.post("/carts/:cid/product/:pid", async (req, res) => {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;
//     try {
//         const { quantity } = req.body;
//         const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
//         res.json({ status: "success", data: updatedCart });
//     } catch (error) {
//         console.error("Error adding product to cart", error);
//         res.status(500).json({ error: "Server internal error" });
//     }
// });


// module.exports = router; 



const express = require("express");
const router = express.Router();
const Cart = require("../models/cart"); 

router.post("/", async (req, res) => {
    try {
        const existingCarts = await Cart.find({});
        const cartId = existingCarts.length > 0 ? Math.max(...existingCarts.map(cart => parseInt(cart.cartId))) + 1 : 1;

        const newCart = new Cart({
            cartId: cartId.toString(),
            products: []
        });
        
        await newCart.save();
        res.status(201).json({ status: "success", data: newCart });
    } catch (error) {
        console.error("Error creating cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


// router.post("/", async (req, res) => {
//     try {
//         const newCart = new Cart({ products: [] }); 
//         await newCart.save();
//         res.status(201).json({ status: "success", data: newCart });
//     } catch (error) {
//         console.error("Error creating cart", error);
//         res.status(500).json({ error: "Server internal error" });
//     }
// });


router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await Cart.findOne({ cartId }).populate('products'); 
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error getting cart by ID", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ cartId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        await cart.save();
        res.json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error adding product to cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

module.exports = router;