
// dependencies
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbConfig.js');

// server
const server =  express();

// session
const sessionConfig = {
    name: 'testSession', // defaults to connect.sid
    secret: 'wonj@3',
    httpOnly: true, // JS can't access this
    resave: false,
    saveUninitialized: false, // laws !
    cookie: {
        secure: false, // over httpS
        maxAge: 1000 * 60 * 1,
    },
};

// middleware
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized' });
    }
};

// endpoints
server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username')
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                res.status(500).json(err);
            });
})

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users')
        .insert(credentials)
            .then(ids => {
                const id = ids[0];
                req.session.username = credentials.username;
                console.log('testing from then');
                res.status(201).json({ newUserId: id })
            })
            .catch(err => {
                res.status(500).json(err);
            });
});

server.post('/login', (req, res) => {
    const credentials = req.body;
    db('users')
        .where({ username: credentials.username })
        .first()
            .then(user => {
                if (user && bcrypt.compareSync(credentials.password, user.password)) {
                    req.session.username = user.username;
                    console.log(req.session.username);
                    res.status(200).json({ welcome: user.username })
                } else {
                    res.status(500).json({ error: 'You shall not pass!'});
                } 
            })
            .catch(err => {
                res.status(500).json(err);
            });
})

// port
const port = 3333;
server.listen(port, () => console.log(`==listening on port ${port}==`));