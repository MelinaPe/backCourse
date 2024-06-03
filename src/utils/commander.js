// Libreria para configurar nuestros argumentos por consola. 

const { Command } = require("commander"); 

const program = new Command(); 


// 1- comando // 2- descripcion // 3- valor por default 
program
    .option("-p <port> ", "port where server runs", 8080)
    .option("--mode <mode>", "work mode", "production")
program.parse(); 


module.exports = program; 