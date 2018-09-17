const express = require('express');

const server = express();
server.use(express.json());

const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);



server.post('/api/register',(req, res) => {
    const user = req.body;
})