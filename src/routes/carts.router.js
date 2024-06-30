const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.js"); 
const { v4: uuidv4 } = require('uuid');
const ProductModel = require("../models/products.js"); 
const mongoose = require('mongoose');
const authorize = require("../middlewares/authorization.js"); 
const Ticket = require("../models/ticket.js"); 
const CartManager = require("../controllers/cartManager.js"); 
const cartManager = new CartManager(); 
const TicketService = require("../services/ticketService.js"); 
const ticketService = new TicketService(); 

// Post cart 
router.post("/", async (req, res) => {
    try {
        const newCart = new Cart({ 
            cartId: uuidv4(), 
            products: [] 
        }); 
        await newCart.save();
        res.status(201).json({ status: "success", data: newCart });
    } catch (error) {
        console.error("Error creating cart", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Get carts 
router.get("/", async (req, res) => {
    try {
        const carts = await Cart.find({});
        res.status(200).json({ status: "success", data: carts });
    } catch (error) {
        console.error("Error getting carts:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Add product to cart 
router.post("/:cartId/addProduct/:productId", authorize(['user']), async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const productId = req.params.productId;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const product = await ProductModel.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        cart.products.push(product._id);
        await cart.save();

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});


// Get cart by ID 
router.get("/:cartId", async (req, res) => {
    try {
        const cartId = req.params.cartId;

        const cart = await Cart.findById(cartId).populate('products');

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error getting cart by ID:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Delete product from cart 
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const index = cart.products.indexOf(productId);

        if (index === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }
        cart.products.splice(index, 1);
        await cart.save();
        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Update cart with array of products
router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { products } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = products;
        await cart.save();

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error updating cart with array of products:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Update quantity of a product in a cart 
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(prod => prod._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error updating product quantity in cart:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// Delete all products from cart 
router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        cart.products = []; 
        await cart.save();

        res.status(200).json({ status: "success", data: cart });
    } catch (error) {
        console.error("Error removing all products from cart:", error);
        res.status(500).json({ error: "Server internal error" });
    }
});

// End purchase 
router.post("/:cid/purchase", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products');

        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        let totalAmount = 0;
        let insufficientStockProducts = [];

        for (let item of cart.products) {
            const product = await ProductModel.findById(item._id);
            if (product.stock < item.quantity) {
                insufficientStockProducts.push(item._id);
            } else {
                product.stock -= item.quantity;
                await product.save();
                totalAmount += product.price * item.quantity;
            }
        }

        if (insufficientStockProducts.length > 0) {
            return res.status(400).json({ 
                error: "Some products have insufficient stock",
                insufficientStockProducts 
            });
        }

        const ticketData = {
            amount: totalAmount,
            purchaser: req.session.user.email
        };

        const ticket = await ticketService.createTicket(ticketData);

        cart.products = cart.products.filter(item => 
            insufficientStockProducts.includes(item._id)
        );
        await cart.save();

        res.status(200).json({ 
            status: "success", 
            message: "Purchase completed successfully", 
            ticket 
        });
    } catch (error) {
        console.error("Error completing purchase:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;