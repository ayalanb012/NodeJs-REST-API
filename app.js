const express = require('express');
const requestHandler = express();
const controller = require('./api/controller');

requestHandler.get('/prev', controller.get_prev_ip);
requestHandler.get('/stats', controller.get_stats);
requestHandler.get('/total', controller.get_prev_count);


requestHandler.use((req, res, next) => {
    const error = new Error('The requested API is not supported.');
    error.status = 404;
    next(error);
})

requestHandler.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = requestHandler;