const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../models/user.model");
const CartManager = require("../controllers/cartManager.js")
const { createHash, isValidPassword } = require("../utils/hashbcrypt");
const GitHubStrategy = require("passport-github2");

// Admin credentials
const adminCredentials = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123'
};

const isAdminCredentials = (email, password) => {
    return email === adminCredentials.email && password === adminCredentials.password;
};

const cartManager = new CartManager(); 

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
    
        try {
            let user = await UserModel.findOne({ email });
    
            if (user) {
                return done(null, false, { message: "User already exists" });
            }
    
            const cart = await cartManager.addCart();
    
            let role = 'user';
            if (isAdminCredentials(email, password)) {
                role = 'admin';
            }
    
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role,
                cartId: cart._id
            }
    
            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Login

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            let user = await UserModel.findOne({ email });
    
            if (isAdminCredentials(email, password)) {
                const adminCart = await cartManager.addCart(); 
                const adminUser = {
                    _id: 'admin-id',
                    first_name: "Admin",
                    last_name: "User",
                    email: adminCredentials.email,
                    role: 'admin', 
                    cartId: adminCart.id 
                };
                return done(null, adminUser);
            }
    
            if (!user) {
                return done(null, false, { message: "User not found" });
            }
    
            if (!isValidPassword(password, user)) {
                return done(null, false, { message: "Invalid password" });
            }
    
            // Si el usuario no tiene un carrito, crea uno nuevo
            if (!user.cartId && user.role !== 'admin') {
                const cart = await cartManager.addCart();
                user.cartId = cart._id;
                await user.save();
            }
    
            return done(null, user);
        } catch (error) {
            console.error("Error during authentication:", error);
            return done(error);
        }
    }));


    // Serializar y deserializar:
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        if (id === 'admin-id') {
            const adminUser = {
                _id: 'admin-id',
                first_name: "Admin",
                last_name: "User",
                email: adminCredentials.email,
                role: 'admin', 
                cartId: 'admin-cart-id'
            };
            return done(null, adminUser);
        } else {
            try {
                let user = await UserModel.findById(id);
                if (user) {
                    done(null, user);
                } else {
                    done(new Error("User not found"));
                }
            } catch (error) {
                done(error);
            }
        }
    });
    
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liu5bEqXcJJ1vSuZ",
        clientSecret: "550bce54e044a55ff34f79ff94c5e24fa775efa7",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                let newUser = {
                    first_name: profile._json.name || profile.username,
                    last_name: "",
                    age: 22,
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

module.exports = initializePassport;