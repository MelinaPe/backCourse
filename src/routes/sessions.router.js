const express = require("express"); 
const router = express.Router(); 
const UserModel = require("../models/user.model"); 
const { isValidPassword } = require("../utils/hashbcrypt"); 
const passport = require("passport"); 
const initializePassport = require("../config/passport.config"); 

// Admin credentials 
// const adminCredentials = {
//     email: 'adminCoder@coder.com',
//     password: 'adminCod3r123'
// };

// const isAdminCredentials = (email, password) => {
//     return email === adminCredentials.email && password === adminCredentials.password;
// };


// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         if (isAdminCredentials(email, password)) {
//             req.session.user = {
//                 email: adminCredentials.email,
//                 role: 'admin'
//             };
//             req.session.login = true;
//             return res.redirect("/products");
//         }

//         const user = await UserModel.findOne({ email: email });
//         if (user) {
//             if (isValidPassword(password, user)) {
//                 req.session.login = true;
//                 req.session.user = {
//                     email: user.email,
//                     first_name: user.first_name,
//                     role: user.role
//                 }
//                 return res.redirect("/products");
//             } else {
//                 return res.status(401).send("Invalid password")
//             }
//         } else {
//             return res.status(404).send("User not found")
//         }
//     } catch (error) {
//         return res.status(400).send("Invalid login");
//     }
// });


// Logout 
router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy(); 
    }
    res.redirect("/login"); 
})

// PASSPORT VERSION 

router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if(!req.user){
        return res.status(400).send("Invalid credentials")
    }

    req.session.user = {
        first_name: req.user.first_name, 
        last_name: req.user.last_name, 
        age: req.user.age, 
        email: req.user.email
    }; 

    req.session.login = true; 

    res.redirect("/profile"); 
})

router.get("/faillogin", async (req, res) => {
    res.send("Login failed"); 
}); 

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"}, async (req, res) => {
        req.session.user = req.user; 
        req.session.login = true; 
        res.redirect("/profile"); 
    }))


module.exports = router; 