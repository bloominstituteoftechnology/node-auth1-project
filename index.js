const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = require('./knexfile.js');
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
  res.send('*** Is your server running, better catch it before it runs away***')
});

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    db('users')
    .insert(credentials)
    .then(ids => {
        const id = ids[0];
        res.status(201).json({ newUserId: id});
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

server.get("/users", (req, res) => {
    db('users')
    .select('id', 'username')
    .then(users => {
        res.json(users);
    })
    .catch(err => res.send (err));
        
});


const port = 9000;
server.listen(port, function() {
console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});