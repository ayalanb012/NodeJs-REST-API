const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
const server = http.createServer(app);
require('dotenv').config();
const port = process.env.PORT;

mongoose.connect(process.env.DB_CONN,{
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

server.listen(port);