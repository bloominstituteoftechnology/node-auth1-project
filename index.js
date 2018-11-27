const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./database/dbConfig.js');

const server = express();

const sessionConfig = {
    secret: 'who.throws.a.shoe.!',
    name: 'monkey',
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 1
    },
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60
    })
};

function protected(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(500).json({ message: 'not authorized' });
    }
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

//login as an existing user

server.post('/api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username
                res.status(200).json({ message: 'welcome' })
            } else {
                res.status(401).json({ message: 'nope' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

// register as a user

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
            res.status(500).json(err)
        })
});

//get all users once login approved

server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json(err)
        })
});

// logout 

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.json('You cannot leave');
            } else {
                res.json('Goodbye');
            }
        });
    }
});

// test server to get up and running

server.get('/', (req, res) => {
    res.json({ message: 'Up and Running' })
})


server.listen(3333, () => console.log('\nrunning on port 3333\n'));