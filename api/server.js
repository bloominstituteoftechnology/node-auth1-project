const express = require('express');

const server = express();

// global middleware configuration
require('./config-middleware')(server);

// routes
server.use('/api', require('../routes/authentication'));
server.use('/api', require('../routes/users'));

server.get('/', (req, res) => {
  res.status(418).send('Server working');
});

module.exports = server;
