const express = require('express');
const server = express();
const knex = require('knex');
const dBConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
//Middleware
server.use(express.json());

const db = knex(dBConfig.development);

//Endpoints
server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(names => {
            const name = names[0];
            res.status(201).json(name);
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
                res.status(200).send('Welcome');
            } else {
                res.status(401).json({ message: 'You are unauthorized' })
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
});

server.listen(3000, console.log('Listening on Port 3000'));