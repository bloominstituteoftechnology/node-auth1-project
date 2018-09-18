const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);
const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json('working');
})

server.post('/api/register', (req, res) => {
    let creds = req.body;

    creds.password = bcrypt.hashSync(creds.password, 5);
    db.insert(creds).into('users')
        .then((data) => {
            res.status(201).json(data);
        })
        .catch(err => res.status(500).json('Invalid'));
});

server.post('/api/login', (req, res) => {
    let creds = req.body;

    db('users').where({ username: creds.username }).first()
        .then((user) => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({ message: `welcome ${creds.username}` });
            } else {
                res.status(401).json({ message: 'Your username and/or password is invalid' });
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get('/api/users', (req, res) => {
    db('users').select('id', 'username')
        .then((data) => {
            res.status(200).json(data);
        })
        .catch(err =>
            res.status(404).json({ message: 'Could not find users database' }))
});

const port = 8000
server.listen(port, console.log(`\n ===> Server is running on port ${port} <=== \n`))