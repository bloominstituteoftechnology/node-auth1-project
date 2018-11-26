const express = require('express');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

const port = 4200;
server.listen(port, console.log(`\n === watching on port ${port} === \n`));