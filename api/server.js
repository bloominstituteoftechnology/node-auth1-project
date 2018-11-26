const express = require('express');
const knex = require('knex');

const configureMiddleware = require('./middleware.js');
const routes = require('./routes.js')
const server = express();


// middleware
configureMiddleware(server);

server.get('/', (req, res) => {
  res.status(200).json({message: 'server up'})
})

server.use('/api', routes);

module.exports = server;