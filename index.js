const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const db = require('./data/dbHelpers.js');

const server = express();

server.use(express.json())
server.use(cors())

server.use(
    session({
        name: "session1",
        secret: "nobody tosses a dwarf!",
        cookie: {
            maxAge: 1 * 24 * 60 * 60 * 1000
        },
        httpOnly: true,
        resave: false,
        saveUninitialized: false
    })
)

const PORT = 4400;

server.get('/api/users', (req, res) => {
    if (req.session && req.session.userId) {
        db.getUsers()
            .then(users => {
                res.json(users)
            })
            .catch(err => {
                res.status(500).send(err)
            });
    } else {
        res.status(400).send('You shall not pass!');
    }
});

server.post('/api/register', (req, res) => {
    const user = req.body;
    console.log('session', req.session);
    user.password = bcrypt.hashSync(user.password, 10);
    db.insertUser(user)
        .then(([id]) => {
            res.status(201).json({ id });
        })
        .catch(err => {
            res.status(500).send(err);
        })
});

server.post('/api/login', (req, res) => {


    const bodyUser = req.body;
    db.findByUsername(bodyUser.username)
        .then(users => {
            if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
                req.session.userId = users[0].id;
                res.json({ info: 'Logged in' })
            } else {
                res.status(404).json({ err: 'You shall not pass!' })
            }
        })
        .catch(err => {
            res.status(500).send(err);
        })
})
// whatever

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));