const passport = require("passport"); 
const local = require("passport-local"); 
const UserModel = require("../models/user.model"); 
const { createHash, isValidPassword } = require("../utils/hashbcrypt"); 
const GitHubStrategy = require("passport-github2"); 

const LocalStrategy = local.Strategy; 

const initializePassport = () => {
    
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const {first_name, last_name, email, age} = req.body; 

        try {
            let user = await UserModel.findOne({email}); 
            
            if (user){
                return done(null, false); 
            }
            let newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password: createHash(password)
            }
            let result = await UserModel.create(newUser); 
            return done(null, result); 
        } catch (error) {
            return done(error)
        }
    }))

    // Login
    passport.use("login", new LocalStrategy({
        usernameField:"email"
    }, async (email, password, done) => {

        try {
            let user = await UserModel.findOne({email}); 
            if (!user) {
                console.log("This user does not exists"); 
                return done (null, false); 
            }
            if (!isValidPassword(password, user)) {
                return done(null, false); 
            }
            return done(null, user); 
        } catch (error) {
            return done(error); 
        }
    }))

    // Serializar y deserializar: 
    passport.serializeUser( (user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async (id, done) => {
        let user = await UserModel.findById({_id: id}); 
        done(null, user); 
    })

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liu5bEqXcJJ1vSuZ", 
        clientSecret: "550bce54e044a55ff34f79ff94c5e24fa775efa7", 
        callbackURL: "http://localhost:8080/api/sessions/githubcallback", 
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Profile:", profile); 

        try {
            let user = await UserModel.findOne({ email: profile._json.email}); 

            if(!user) {
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
    }))
}

module.exports = initializePassport; 