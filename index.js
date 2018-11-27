const express = require("express");
const knex = require("knex");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

const server = express();

const sessionConfig = {
    name: 'authCookie',
    secret: 'abcdthgsaqw23rrsefsd54tdsfsf3rghjb;desf',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createable: true,
        clearInterval: 1000 * 60 * 60,
    }),
};

server.use(session(sessionConfig));
server.use(express.json());
server.use(cors());

function protected(req, res, next) {
    if(req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Access Denied...' });
    }
}

// get all users
server.get('/api/users', protected, (req, res) => {
    db('users').select('id', 'username').then(users => {
        res.json(users);
    }).catch(err => res.status(400).json(err));
});

server.get('/api/me', protected, (req, res) => {
    db('users')
      .select('id', 'username')
      .where({ id: req.session.user })
      .first()
      .then(users => {
        res.json(users);
      })
      .catch(err => res.status(400).json(err));
  });
  

// register user
server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users').insert(creds).then(ids => {
        res.status(201).json(ids);
    }).catch(err => res.status(400).json(err));
})

// login user
server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users').where({ username: creds.username }).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.user = user.id;
            res.status(200).json({ user });
        } else {
            res.status(401).json({ message: 'Wrong username or password. Try again...' });
        }
    }).catch(err => res.status(400).json(err));
});

// logout
server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.send("Error logging out");
            } else {
                res.send("Logged Out");
            }
        });
    } else {
        res.end();
    }
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));