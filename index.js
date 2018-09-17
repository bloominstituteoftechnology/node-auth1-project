const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./dbConfig.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

// endpoints

server.get('/', (req, res) => {
    res.send('Abracdabra!');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
    .insert(creds)
    .then(ids => {
        const id = ids[0];

        res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err))
})