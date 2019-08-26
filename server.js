const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

server.get('/', (req, res) => {
  res.send('<h1> WeB AuTh<h1>');
});

module.exports = server;
