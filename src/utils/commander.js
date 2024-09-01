// Libreria para configurar nuestros argumentos por consola. 

const { Command } = require("commander"); 

const program = new Command(); 


program
    .option("-p <port> ", "port where server runs", 8080)
    .option("--mode <mode>", "work mode", "production")
program.parse(); 


module.exports = program; 