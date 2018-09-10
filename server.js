const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(helmet());
server.use(express.json()); // don't forget this

//start server
server.get('/', (req, res) => {
res.send('API Running...');
});

server.listen(9000);