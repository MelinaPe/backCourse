const express = require('express');
const ProductManager = require('./main'); 
const app = express();
const path = require('path');
const port = 8080; 

const productsFilePath = path.join(__dirname, 'products.json'); 
const manager = new ProductManager(productsFilePath); 

app.get('/', (req, res) => {
    res.send('Welcome ;)');
});


app.get('/products', async (req, res) => {
    try {
        let limit = req.query.limit; 
        let products = await manager.getProducts(); 
        if (limit) {
            products = products.slice(0, limit); 
        }
        const formattedJSON = JSON.stringify(products, null, 2);
        res.send(`<pre>${formattedJSON}</pre>`);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).send("Error interno del servidor");
    }
});


app.get('/products/:pid', async (req, res) => {
    try {
        let productId = parseInt(req.params.pid); 
        let product = await manager.getProductById(productId); 
        if (product) {
            res.json(product); 
        } else {
            res.status(404).send("Product not found");
        }
    } catch (error) {
        console.error("Error getting product by ID:", error);
        res.status(500).send("Server internal error");
    }
});


app.listen(port, () => {
    console.log(`App in port: http://localhost:${port}`);
});
