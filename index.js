const express = require('express');
const cors = require('cors');
const knex = require('knex');

const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(cors());

// listening port
const port = 500;
server.listen(port, function() {
  console.log(`\n=== API listening on port ${port} ===\n`);
});