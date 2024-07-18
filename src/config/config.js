// instalo dependencia para manejar las variables de entorno : dotenv

const dotenv = require("dotenv"); 
const program = require("../utils/commander.js")

const { mode } = program.opts(); 

dotenv.config({
    path: mode === "production" ? "./.env.production":"./.env.development"    
}); 

const configObject = {
    mode: mode,
    port: process.env.PORT, 
    mongo_url: process.env.MONGO_URL
}

module.exports = configObject; 
