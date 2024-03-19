const express = require('express');
const app = express();
const port = 8080; 
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")

// Middleware 
app.use(express.urlencoded({extended:true})); 
app.use(express.json()); 

// Routes
app.use("/api", productsRouter); 
app.use("/api", cartsRouter)


app.listen(port, () => {
    console.log(`App in port: http://localhost:${port}`);
});

