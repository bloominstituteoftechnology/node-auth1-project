const express = require('express');

const configureMiddleware = require('../config/middleware');
const configureRoutes = require('../config/routes');

const server = express();
configureMiddleware(server);
configureRoutes(server);

module.exports = server;