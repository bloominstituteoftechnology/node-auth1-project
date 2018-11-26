const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);

    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => {
            res.status(500).json({ error: 'Authentication error' });
        });
});

server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: 'There was an error fetching the users', err });
        });
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}`});
            } else {
                res.status(401).json({ message: 'Authentication failed.' });
            }
        });
});

// tested with postman
server.listen(3000, () => console.log('\n Server is running on port 3000 \n' ));