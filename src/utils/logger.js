const winston = require("winston"); 
const config = require("../config/config.js"); 

// Levels 

const levels = {
    levels: {
        fatal: 0, 
        error: 1, 
        warning: 2, 
        info: 3, 
        http: 4, 
        debug: 5
    }, 
    colors: {
        fatal: "red", 
        error: "yellow", 
        warning: "blue", 
        info: "green", 
        http: "magenta", 
        debug: "white"
    }
}; 

winston.addColors(levels.colors); 


// Logger development

const loggerDev = winston.createLogger({
    levels: levels.levels, 
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})

// Logger production 

const loggerPro = winston.createLogger({
    levels: levels.levels, 
    transports: [
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error", 
            format: winston.format.simple()
        })
    ]
});


const logger = config.mode === "production" ? loggerPro : loggerDev; 


// Create middleware to export in app.js

const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`); 
    next(); 
}

module.exports = addLogger; 


