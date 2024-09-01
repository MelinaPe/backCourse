const express = require('express');
const router = express.Router(); 
const ProductManager = require("../controllers/productManager.js"); 
const productManager = new ProductManager("./src/models/products.json"); 
const Cart = require("../models/cart.js"); 
const authorize = require("../middlewares/authorization.js"); 
const UserModel = require("../models/user.model.js"); 
const bcrypt = require('bcrypt');

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

        console.log("Cart ID in session:", req.session.user.cartId);
        
        res.render("products", { 
            user: req.session.user,
            cartId: req.session.user.cartId 
        }); 
    } catch(error) {
        res.status(500).json({ error: "Server internal error" })
    }
});

router.get("/admin", authorize(['admin']), async (req, res) => {
    try {
        console.log("Fetching users...");  
        const users = await UserModel.find({}, 'first_name last_name email role');  
        
        console.log("Users fetched:", users);  
        
        res.render('admin', {
            user: req.session.user, 
            users: users 
        });
    } catch (error) {
        console.error('Error rendering admin view:', error);
        res.status(500).send('Internal Server Error');
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



router.get('/cart/:cartId', async (req, res) => {
    try {
        if (!req.session.login) {
            return res.redirect("/login");
        }

        const cartId = req.params.cartId;
        const cart = await Cart.findById(cartId).populate('products.product');

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        res.render('cartview', { 
            user: req.session.user,
            cartId: cartId,
            cartData: cart.toObject(), 
            total: cart.products.reduce((acc, item) => acc + item.quantity * item.product.price, 0) 
        });
    } catch (error) {
        console.error('Error getting cart by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out.');
        }
        res.clearCookie('connect.sid'); 
        res.status(200).send('Logged out successfully'); 
    });
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});


router.get('/reset/:token', async (req, res) => {
    try {
        const user = await UserModel.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        res.render('reset-password', { token: req.params.token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});


router.post('/reset/:token', async (req, res) => {
    try {
        const user = await UserModel.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send('Password has been reset successfully');
    } catch (error) {
        console.error("ERROR : ", error)
        res.status(500).send('Server error');
    }
});



module.exports = router; 