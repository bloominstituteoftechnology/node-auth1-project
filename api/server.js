const express = require('express');

const configureMiddleware = require('./configure-middleware.js');
const apiRouter = require('./api-router.js');
const server = express();

configureMiddleware(server); 
server.use('/api', apiRouter);


module.exports = server;
