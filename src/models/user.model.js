const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    }, 
    last_name: {
        type: String, 
        //required: true
    }, 
    email: {
        type: String, 
        required: true, 
        index: true, 
        unique: true
    }, 
    password: {
        type: String, 
        //required: true
    }, 
    age: {
        type: Number, 
        //required: true
    }, 
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' 
    }, 
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        default: null 
    },
    lastConnection: {
        type: Date, 
        default: Date.now  
    },
    resetPasswordToken: {
        type: String,
        default: null 
    },
    resetPasswordExpires: {
        type: Date,
        default: null 
    }
})

const UserModel = mongoose.model("user", schema); 

module.exports = UserModel;

