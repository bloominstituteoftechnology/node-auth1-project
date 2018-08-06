const express = require('express');
const db = require('./data/db');
const server = express();

const bcrypt = require("bcrypt");

server.use(express.json());

server.get('/', (req, res) => {
  res.send('up and running...');
});

const port = 8080;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
