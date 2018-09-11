
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('../db/dbConfig');

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

router.get('/users', (req, res) => {  //new
    if(req.session && req.session.username) {
        db('usernames').select('id', 'username', 'password')
        .then(users => {
        res.status(200).json(users)
        })
        .catch(err => console.log(err));
    } else {
        res.status(401).json({ message: 'You are not logged in.' }) 
    } 
});

module.exports = router;