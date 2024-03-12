const fs = require("fs"); 


class ProductManager {
    constructor() {
        this.products = []; 
        this.path = "./products.json"; 
        this.productIdCounter = 1; 
    }


    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if(!title || !description || !price || !thumbnail || !code || !stock){
            console.log("All fields are required"); 
            return; 
        }
        
        const existingProduct = this.products.find(product => product.code === code); 
        
        if (existingProduct) {
            console.log("The code already exists.")
            return; 
        } else { 
            const product = {id: this.productIdCounter++, title, description, price, thumbnail, code, stock }; 

            this.products.push(product);
            //console.log(product); 

            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));  
        }
    } 

    getProducts = async () => {
        try {
            const readFile = await fs.promises.readFile("./products.json", "utf-8");
            const productsArray = JSON.parse(readFile); 
            return productsArray; 
        } catch (error) {
            console.error("Error reading the file:", error);
            throw error; 
        }
    }

    getProductById = async(id) => {
        try {
            const readFile = await fs.promises.readFile("./products.json", "utf-8");
            const productsArray = JSON.parse(readFile);
            const product = productsArray.find(product => product.id === id);
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

    updateProduct = async(id, newStock) => {
        try{
            const productUpdated = await this.getProductById(id); 
            if (!productUpdated) {
                console.log("Product not found"); 
                return; 
            }

            productUpdated.stock = newStock; 

            const readFile = await fs.promises.readFile("./products.json", "utf-8"); 
            const productsArray = JSON.parse(readFile); 
            const updateProductsArray = productsArray.map(p => p.id === id ? productUpdated : p); 

            await fs.promises.writeFile("./products.json", JSON.stringify(updateProductsArray, null, 2)); 
            console.log("Product updated: ", productUpdated); 
        } catch (error){
            console.log("Error updating product: ", error); 
        }
    }

    deleteProduct = async(id) => {
        try{
            const productDelete = await this.getProductById(id); 
            if(!productDelete) {
                console.log("Product not found"); 
                return; 
            }

            const readFile = await fs.promises.readFile("./products.json", "utf-8"); 
            const productsArray = JSON.parse(readFile); 
            const updatedProductsArray = productsArray.filter(p => p.id !== id);

            await fs.promises.writeFile("./products.json", JSON.stringify(updatedProductsArray, null, 2));
            console.log("Product removed:", productDelete);

        } catch(error) {
            console.log("Error deleting product: ", error); 
        }

    }

}  


module.exports = ProductManager;
