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

server.post('/api/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 3);

    credentials.password = hash;

    db('users').insert(credentials).then(ids => {
        const id = ids[0];

        res.status(200).json(id);
    }).catch(err => res.status(500).send(err));
});

server.listen(8000);