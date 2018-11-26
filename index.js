const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

const server = express();
server.use(express.json());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash =  bcrypt.hashSync(creds.password, 8);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(error => {
            res.status(500).json(error)
        });
} )

server.listen(8000, () => console.log('running on port 8000'));