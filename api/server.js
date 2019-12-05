//? s3
const express = require('express');

//? s20
const apiRouter = require('./api-router.js');

//? s10
const configureMiddleware = require('./configure-middleware.js');

//? s4
const server = express();

//? s11
configureMiddleware(server)

//? s12 create api-router.js file 

//? s5
server.use('/api', apiRouter)

//? s6
module.exports = server;

//? s7 create configure-middleware.js for middleware ie helmet, cors, express, etc...