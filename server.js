const express = require('express');

const server = express();

server.use(express.json());

const db = require('./auth/db');
const bcrypt = require('bcryptjs');


server.get('/', (req, res) => {
    res.send('Up and running...')
})

server.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => res.status(500).json(err));
});

server.post('/register', (req, res) => {
	const user = req.body;
	const hash = bcrypt.hashSync(user.password, 14);
	user.password = hash;

    db('users')
        .insert(user)
        .then(ids => {
            db('users')
                .where({ id: ids[0] })
                .first()
                .then(user => {
                    res.status(201).json(user);
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/login', (req, res) => {
	const credentials = req.body;

    db('users')
        .where({email: credentials.email})
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(credentials.password, user.password)) {
                res.send('Logged in')
            } else {
                res.status(401).json({ error: 'You shall not pass'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

const port = 8000;

server.listen(port, function() {
    console.log(`\n--- Web API Listening on http://localhost:${port} ---\n`);
})