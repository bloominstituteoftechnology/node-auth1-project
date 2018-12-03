const express = require("express");
const bcrypt = require('bcryptjs');

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);


const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Its alive!');
});

server.get('/users', (req, res) => {
    db('authorize')
    .then(creds => {
        res.json(creds)
    })
})

server.post('/register', (req, res) => {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('authorize')
    .insert(credentials)
    .then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id })
    })
    .catch( err => {
        res.status(500).json(err)
    })
})










server.listen(8000, () => console.log("\n== Port 8k ==\n"));