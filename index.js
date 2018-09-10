const express = require('express');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('API Running...');
});

server.listen(8000);