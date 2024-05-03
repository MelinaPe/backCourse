const express = require('express');
const exphbs = require('express-handlebars');
const socket = require("socket.io");
const app = express();
const port = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const connectDB = require("./dataBase.js");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("src/public"));

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
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(port, () => {
    console.log(`App in port: http://localhost:${port}`);
});

const io = socket(httpServer);
const ProductManager = require("./controllers/productManager.js");

io.on("connection", async (socket) => {
    const productManager = new ProductManager();

    socket.emit("products", await productManager.getProducts());

    socket.on("removeProduct", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("products", await productManager.getProducts());
    });

    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        socket.emit("products", await productManager.getProducts());
    });
}); 




