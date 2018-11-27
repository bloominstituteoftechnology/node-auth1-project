const express = require('express');

const configureMiddleware = require('../config/middleware.js');

const server = express();

configureMiddleware(server);

module.exports = server;