const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./db/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

// endpoints

server.get('/', (req, res) => {
    res.send('We Are Live!');
});

server.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 10);
    
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
        const id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).send('Logged in');
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.send(err));
});

const port = 5000;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});