const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.use(
    session({
        name: 'session1',
        secret: 'lambda secret',
        cookie: {
            maxAge: 1*24*60*60*1000,
            secure: false,
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false,
        store: new KnexSessionStore({
            tablename: 'sessions',
            sidfieldname: 'sid',
            knex: db,
            createtable: true,
            clearInterval: 60*60*1000,
        })
    })
);
 
const protected = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'You must be logged in to access this page.' });
    }
}

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

server.get('/api/users', protected, (req, res) => {
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
                req.session.username = user.username;
                res.status(200).json({ message: `Welcome ${req.session.username}`});
            } else {
                res.status(401).json({ message: 'Authentication failed.' });
            }
        });
});

server.get('/api/logout', protected, (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({ error: 'Error logging out', err });
            } else {
                res.status(200).json({ message: 'Logout successful.' });
            }
        });
    }
});

// tested with postman
server.listen(3000, () => console.log('\n Server is running on port 3000 \n' ));