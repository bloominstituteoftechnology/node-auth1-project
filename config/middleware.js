const helmet = require('helmet');
const express = require('express');
const routes = require('../routes/routes.js');

module.exports = server=>{
    server.use(helmet());
    server.use(express.json());
    server.use('/', routes);
}