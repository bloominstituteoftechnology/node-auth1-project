const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcryptjs = require('bcryptjs');


const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  res.send('***THIS SERVER IS RUNNING***')
});


const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});