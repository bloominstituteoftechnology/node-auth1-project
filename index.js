const express = require('express');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const bcrypt = require('bcryptjs'); // adds hash library

const db = require('./database/dbConfig.js');

const server = express();

const sessionConfig = {
    name: 'superSecret',
    secret: `(>'.')><('.')><('.'<)`,
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes
        secure: false // true for production
    },
    httpOnly: true, // no js
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'userSessions',
        sidfieldname: 'sessionId',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60, // 1 hour
    })
}

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

// [GET] /
// test endpoint
server.get('/', (req, res) => {
    res.send('Server running');
});

// [GET] /api/users
// return all usernames with id
server.get('/api/users', (req, res) => {
    if (req.session && req.session.userId) {
        db('users')
            .select('id', 'username')
            .then(users => {
                if (users.length) {
                    res.status(200).json(users);
                } else {
                    res.status(200).json({ message: 'No users in database' })
                }
            })
            .catch(err => {
                res.status(500).json({ message: 'Error retrieving users ' });
            });
    } else {
        res.status(401).json({ message: 'Forget about it!' });
    }
});

// [POST] /api/register
// create account with username and password, fails if username already exists
server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(id => {
            res.status(201).json({ id: id[0] });
        })
        .catch(err => {
            if (err.errno === 19) {
                res.status(500).json({ message: 'Username already exists' });
            } else {
                res.status(500).json({ message: 'Error creating new account' });
            }
        });
});

// [POST] /api/login
// user login, fails if username does not exist or password incorrect
server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.userId = user.id;
                res.status(200).json({ message: 'Correct username and password, good job!' });
            } else {
                res.status(401).json({ message: 'Failed authentication, username does not exist or password is incorrect' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error occurred during login' });
        })


});

const port = 8765;
server.listen(port, () => console.log(`\nServer listening on port ${port}\n`));