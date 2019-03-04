const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
 
server.get('/', (req, res) => {
  res.send("It's alive!");
});

module.exports = server; 