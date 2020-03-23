const express = require('express');

const server = express();

server.get('/', (req, res) => {
  res.send({server: 'up'});
});

module.exports = server;
