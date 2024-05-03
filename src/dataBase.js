const mongoose = require("mongoose"); 

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://entinfotografia:dejatedejoder1@cluster0.z5ighoj.mongodb.net/merliDataBase?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

module.exports = connectDB;        


