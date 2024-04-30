const mongoose = require("mongoose"); 
const mongoosePaginate = require("mongoose-paginate-v2"); 

const productSchema = new mongoose.Schema({
    title: {
        type: String, 
        index: true
    }, 
    description: String, 
    price: Number, 
    code: {
        type: String, 
        unique: true
    }, 
    stock: Number,
    status: Boolean, 
    category: String 
});

productSchema.plugin(mongoosePaginate);

const ProductModel = mongoose.model("products", productSchema); 

module.exports = ProductModel; 



