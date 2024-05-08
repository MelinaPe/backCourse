const express = require("express"); 
const router = express.Router(); 
const UserModel = require("../models/user.model"); 
const { createHash } = require("../utils/hashbcrypt"); 

// route post to generate an user and save it in Mongodb

router.post("/", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        const userExists = await UserModel.findOne({email}); 
        if (userExists) {
            return res.status(400).send("The email is already registered"); 
        }
        const newUser = await UserModel.create({
            first_name, 
            last_name, 
            email, 
            password: createHash(password), 
            age
        }); 

        req.session.user = {
            email: newUser.email, 
            first_name: newUser.first_name
        }; 
        req.session.login = true; 

        res.status(200).send("User created successfully"); 
    } catch (error) {
        res.status(500).send("Error creating user"); 
        console.log(error); 
    }
})

module.exports = router; 