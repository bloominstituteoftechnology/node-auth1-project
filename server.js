const express = require('express');
const server = express();
const configMiddleware = require('./middleware/middleware');

configMiddleware(server);

server.get('/', (req, res) => {
  res
    .status(200)
    .json({
      api: "Welcome to the server!"
    })
})

module.exports = server;