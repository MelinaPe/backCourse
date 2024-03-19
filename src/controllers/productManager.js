const fs = require("fs");
const fsPromises = require("fs").promises;



class ProductManager {
    constructor() {
        this.path = "./src/models/products.json";
    }

    async addProduct(title, description, price, thumbnail, code, stock, category) {

        const status = true; 

        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.log("All fields are required");
            return;
        }

        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const existingProducts = JSON.parse(data);

            const existingProduct = existingProducts.find(product => product.code === code);
            if (existingProduct) {
                console.log("The code already exists.");
                return;
            }

            const productId = existingProducts.length > 0 ? Math.max(...existingProducts.map(product => product.id)) + 1 : 1;

            const newProduct = { id: productId, title, description, price, thumbnail, code, stock, status, category };

            existingProducts.push(newProduct);

            await fs.promises.writeFile(this.path, JSON.stringify(existingProducts, null, 2));
            console.log("Product added successfully");
        } catch (error) {
            console.error("Error adding product", error);
        }
    }

    getProducts = async () => {
        try {
            const readFile = await fs.promises.readFile("./src/models/products.json", "utf-8");
            const productsArray = JSON.parse(readFile); 
            return productsArray; 
        } catch (error) {
            console.error("Error reading the file:", error);
            throw error; 
        }
    }

    getProductById = async(id) => {
        try {
            const readFile = await fs.promises.readFile("./src/models/products.json", "utf-8");
            const productsArray = JSON.parse(readFile);
            const product = productsArray.find(product => product.id === parseInt(id));
            if (!product) {
                console.log("Product not found.");
            } else {
                console.log(product);
                return product; 
            }
        } catch (error) {
            console.error("Error reading the file:", error);
        }
    }  

    updateProduct = async (id, updatedFields) => {
        try {
            const data = await fsPromises.readFile(this.path, 'utf-8');
            const productsArray = JSON.parse(data);
            const productIndex = productsArray.findIndex(product => product.id === parseInt(id));
    
            if (productIndex === -1) {
                console.log("Product not found");
                return;
            }
    
            Object.keys(updatedFields).forEach(key => {
                if (key !== 'id') {
                    productsArray[productIndex][key] = updatedFields[key];
                }
            });
    
            await fsPromises.writeFile(this.path, JSON.stringify(productsArray, null, 2));
    
            console.log("Product updated successfully");
        } catch (error) {
            console.error("Error updating product:", error);
        }
    }

    deleteProduct = async (id) => {
        try {
            const data = await fsPromises.readFile(this.path, 'utf-8');
            const productsArray = JSON.parse(data);
            
            const productIndex = productsArray.findIndex(product => product.id === parseInt(id));
    
            if (productIndex === -1) {
                console.log("Product not found");
                return;
            }
    
            productsArray.splice(productIndex, 1);

            await fsPromises.writeFile(this.path, JSON.stringify(productsArray, null, 2));
    
            console.log("Product removed successfully");
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
}  


module.exports = ProductManager;
