const express = require('express');

const db = require('./data/db');

const server = express();

server.use(express.json());


const port = 8000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});