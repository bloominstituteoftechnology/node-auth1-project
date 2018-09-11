
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('../db/dbConfig');
const protected = require('../middlewares/middleware');

const router = express.Router();

const sessionConfig = { //new
    name: 'banana', // default is connect.sid
    secret: 'nobody tosses a dwarf!',
    cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, // only set cookies over https. Server will not send back a cookie over http.
    }, // 1 day in milliseconds
    httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({  // Store configurations to make loggin persistent
        tablename: 'sessions',
        sidfieldname: 'sid',
        knex: db,
        createTable: true,
        clearInterval: 1000 * 60 * 60,
    })
};

router.use(session(sessionConfig)); // new 

router.post('/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 10);

    creds.password = hash;

    db('usernames')
        .insert(creds)
        .then(ids => {
            const id = ids[0];

            res.status(201).json(id);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/login', (req, res) => {
    const creds = req.body;

    db('usernames')
        .where({ username: creds.username })
        .first().then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;
                
                res.status(200).send('Logged in');
            } else {
                res.status(401).json({ error: "You shall not pass!"})
            }
        })
        .catch(err => res.status(500).send(err))
});

router.get('/users', protected, (req, res) => {  // implemented protected middleware
    db('usernames')
        .select('id', 'username', 'password')
        .then(users => {
        res.status(200).send(users)
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;