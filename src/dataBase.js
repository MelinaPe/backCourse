const mongoose = require("mongoose"); 
const configObject = require("./config/config.js"); 

const connectDB = async () => {
    try {
        await mongoose.connect(configObject.mongo_url);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

module.exports = connectDB;        


