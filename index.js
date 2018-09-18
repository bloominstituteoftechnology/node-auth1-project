const express = require('express');
const server = express();
const knex = require('knex');
const dBConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const session = require('express-session');
//Middleware
server.use(express.json());
server.use(
    session({
        name: 'somesession',
        secret: '@!!!!!%%%vilksioeknfk!!?#*',
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            secure: false
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
    })
);
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
                req.session.username = user.username;

                res.status(200).send(`Welcome ${req.session.username}`);
            } else {
                res.status(401).json({ message: 'You are unauthorized' })
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get('/api/name', (req, res) => {
    req.session.name = username;
    res.send('success!');
});

server.get('/api/greeting', (req, res) => {
    const name = req.session.name;
    res.send(`Hello ${name}`);
});

server.get('/api/users', (req, res) => {
    if (req.session && req.session.username) {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
    }
    res.status(401).json({ message: 'You are not allowed!'});
});

server.listen(3000, console.log('Listening on Port 3000'));