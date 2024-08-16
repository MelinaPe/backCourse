const express = require("express"); 
const router = express.Router(); 
const UserModel = require("../models/user.model"); 
const { createHash } = require("../utils/hashbcrypt"); 
const passport = require("passport"); 
const initializePassport = require("../config/passport.config");  
const authorize = require("../middlewares/authorization"); 

// PASSPORT VERSION

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}) , async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Invalid credentials"); 
    }

    req.session.user = {
        first_name: req.user.first_name, 
        last_name: req.user.last_name, 
        age: req.user.age, 
        email: req.user.email
    }; 

    req.session.login = true; 

    res.redirect("/profile"); 

}); 

router.get("/failedregister", async (req, res) => {
    res.send("Failed register"); 
}); 

router.get("/", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/:uid", async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router; 