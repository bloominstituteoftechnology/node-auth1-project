const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  res.send(`
    <h2>Fuzzy Raiders</h2>
    <p>Server is running!</p>
    `)
});

module.exports = server;