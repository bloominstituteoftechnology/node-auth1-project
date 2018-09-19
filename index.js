const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./dbAccess');

const server = express();
const knexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    name: 'snickerdoodle',
    secret: "don't try this at home",
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore ({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 60,
    })
};

server.use(session(sessionConfig));

server.use(express.json());
server.use(cors());

function protected(req, res, next) {
    if(req.session && req.session.username) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);
    creds.password = hash;

    db('users')
        .insert(creds)
        .then(ids => {
            const id = ids[0];
            res.status(201).json(id);
        })
        .catch(err => {
            console.log('/api/register POST error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password )) {
                req.session.username = user.username;
                res.status(200).send(`Welcome ${req.session.username}`);
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        })
        .catch(err => {
            console.log('/api/login POST error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send('Error logging out');
            } else {
                res.send('Goodbye');
            }
        });
    }
});

server.get('/setname', (req, res) => {
    req.session.name = 'Alex';
    res.send('got it');
});

server.get('/greet', (req, res) => {
    const name = req.session.username;
    res.send(`Hello ${name}`);
});

server.get('/api/users', protected, (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.log('/api/users GET error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.get('/api/admin', protected, (req, res) => {
    db('users')
        .select('id', 'username', 'password')
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            console.log('/api/users GET error:', err);
            res.status(500).send('Please try again later.');
        });
});

server.listen(9000, () => console.log('\n== API on port 9k ==\n'));