const express = require("express");
const knex = require("knex");
const bcrypt = require('bcryptjs');

const knexConfig = require("./knexfile.js");

const db = knex(knexConfig.development);

const server = express();
server.use(express.json());

// get all users
server.get('/users', (req, res) => {
    db('users').select('id', 'username', 'password').then(users => {
        res.json(users);
    }).catch(err => res.send(err));
});

// register user
server.post('/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users').insert(creds).then(ids => {
        res.status(201).json(ids);
    }).catch(err => json(err));
})

// login user
server.post('/login', (req, res) => {
    const creds = req.body;

    db('users').where({ username: creds.username }).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            res.status(200).json({ message: 'Logged in' });
        } else {
            res.status(401).json({ message: 'Wrong username or password. Try again...' });
        }
    }).catch(err => res.json(err));
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));