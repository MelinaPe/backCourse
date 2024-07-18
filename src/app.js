const express = require('express');
const exphbs = require('express-handlebars');
const socket = require("socket.io");
const app = express();
const port = 8080;
const productsRouter = require("./routes/product.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const connectDB = require("./dataBase.js");
const session = require('express-session'); 
const cookieParser = require('cookie-parser'); 
const MongoStore = require('connect-mongo'); 
const usersRouter = require("./routes/user.router.js"); 
const sessionsRouter = require("./routes/sessions.router.js"); 
const passport = require("passport"); 
const initializePassport = require("./config/passport.config.js"); 
const authorize = require("./middlewares/authorization.js"); 
const CartManager = require("./controllers/cartManager.js"); 
const ProductManager = require("./controllers/productManager.js"); 
// Import jsonwektoken, saved for later, I'm not using it right now.
const jsonwebtoken = require("jsonwebtoken"); 
const errorHandler = require('./middlewares/errorHandler.js');
const addLogger = require('./utils/logger.js');


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("src/public"));
app.use(addLogger); 

// Routes for testing Logger 
app.get("/loggerTest", (req, res) => {
    req.logger.http("Message HTTP");
    req.logger.info("Message INFO");
    req.logger.warning("Message WARNING");
    req.logger.error("Message ERROR");             

    res.send("Logs"); 
})




app.use(session({
    secret: "secretLog", 
    resave: true, 
    saveUninitialized: true, 

    // MongoStorage
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://entinfotografia:dejatedejoder1@cluster0.z5ighoj.mongodb.net/merliDataBase?retryWrites=true&w=majority&appName=Cluster0", ttl:100
    })
}))

// PASSPORT IMPLEMENTATION: 
app.use(passport.initialize()); 
app.use(passport.session()); 
initializePassport(); 


// Middleware authentication 
function auth(req, res, next) {
    if (req.session.user === "" && req.session.admin === true) {
        return next(); 
    }
    return res.status(403).res.send("Authentication error. ");
}

// Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// MongoDB Connection
connectDB();

app.get("/api/checkdbconnection", (req, res) => {
    if (db.readyState === 1) { 
        res.status(200).json({ message: "MongoDB connected successfully" });
    } else {
        res.status(500).json({ message: "MongoDB connection failed" });
    }
});

// Routes
app.get("/", (req, res) => {
    res.redirect("/login"); 
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter); 
app.use("/api/sessions", sessionsRouter); 
app.use("/", viewsRouter);
app.use(cookieParser()); 

// Error handling middleware
app.use(errorHandler); 

// Authorization middleware
// app.use("/api/products", authorize(['admin'])); 
// app.use("/api/carts/:cartId/addProduct/:productId", authorize(['user'])); 


const httpServer = app.listen(port, () => {
    console.log(`App in port: http://localhost:${port}`);
});

// const io = socket(httpServer);
// const ProductManager = require("./controllers/productManager.js");


// io.on("connection", async (socket) => {
//     const productManager = new ProductManager();

//     socket.emit("products", await productManager.getProducts());

//     socket.on("removeProduct", async (id) => {
//         await productManager.deleteProduct(id);
//         socket.emit("products", await productManager.getProducts());
//     });

//     socket.on("addProduct", async (product) => {
//         await productManager.addProduct(product);
//         socket.emit("products", await productManager.getProducts());
//     });



const io = socket(httpServer);
const productManager = new ProductManager();
const cartManager = new CartManager();

io.on("connection", async (socket) => {
    socket.emit("products", await productManager.getProducts());

    socket.on("removeProduct", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socket.emit("products", await productManager.getProducts());
    });

    socket.on("addToCart", async ({ cartId, productId }) => {
        await cartManager.addProductToCart(cartId, productId);
        socket.emit("cartUpdated", await cartManager.getCartById(cartId));
    });
}); 



