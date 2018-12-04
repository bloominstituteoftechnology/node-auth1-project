const express = require('express');
const server = express();

server.get('/', (req, res) => {
  res
    .status(200)
    .json({
      api: "Welcome to the server!"
    })
})

module.exports = server;