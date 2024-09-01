const express = require("express");
const router = express.Router();
const passport = require("passport");
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const UserDTO = require("../dto/UserDTO");
const CartManager = require("../controllers/cartManager"); 
const UserModel = require("../models/user.model"); 
const { sendEmail } = require("../services/emailService"); 

// Logout
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
});

// PASSPORT VERSION

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Invalid credentials");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role || 'user', 
        cartId: req.user.cartId 
    };

    req.session.login = true;

    res.redirect("/products");
});

router.get("/faillogin", async (req, res) => {
    res.send("Login failed");
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("User not authenticated");
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role || 'user', 
        cartId: req.user.cartId
    };
    req.session.login = true;
    res.redirect("/profile");
});

router.get("/current", (req, res) => {
    if (req.session.user) {
        const userDTO = new UserDTO(req.session.user);
        return res.status(200).json(userDTO);
    } else {
        return res.status(401).json({ error: "Not authenticated" });
    }
});

// Forgotten password 
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("User found:", user);

        const token = crypto.randomBytes(20).toString('hex');
        console.log("Generated token:", token);


        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
        console.log("User updated with reset token");

        const resetUrl = `http://${req.headers.host}/reset/${token}`;
        const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        await sendEmail(user.email, 'Password Reset', message);
        console.log('Password reset email sent successfully');
        res.status(200).json({ message: 'Recovery email sent successfully' });


    } catch (error) {
        console.error('Error in forgot-password route:', error); 
        res.status(500).json({ error: 'Server error' });
    }
});

// Update pass
router.post('/reset/:token', async (req, res) => {
    try {
        const user = await UserModel.findOne({ 
            resetPasswordToken: req.params.token, 
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpires = undefined; 
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;