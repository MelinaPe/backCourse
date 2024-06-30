const errors = require('../utils/errors.js');

function errorHandler(err, req, res, next) {
    const error = errors[err.message] || {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
    };
    res.status(500).json({ error: error.code, message: error.message });
}

module.exports = errorHandler;