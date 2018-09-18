const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const dbConfig = require('./knexfile');
const session = require('express-session');
const helmet = require('helmet');
const knexSessionStore = require('connect-session-knex')(session);
const store = new knexSessionStore()
const sessionConfig = {
    name: 'notsession', // default connect.sid
    secret: `I can't tell you that`,
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // a day
        secure: false, // only set cookies over https. Server will not send back a cookie over http
    },
    httpOnly: true, // don't let 35 code access cookies. Browser extensions run 35 code on your browser
    resave: false,
    saveUninitialized: false,
    store
};

const db = require('./db/helpers');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(session(sessionConfig));

server.get('/', (req, res) => {
    req.session.name = 'This Session';
    res.status(200).json('working');
});

server.get('/greet', (req, res) => {
    const name = req.session.name;
    res.send(`hello ${name}`)
})

server.post('/api/register', (req, res) => {
    let creds = req.body;
    creds.password = bcrypt.hashSync(creds.password, 5);

    db.registerUser(creds)
        .then((data) => {
            res.status(201).json(data);
        })
        .catch(err => res.status(500).json('Invalid'));
});

server.post('/api/login', (req, res) => {
    let creds = req.body;

    db.loginUser(creds)
        .then((user) => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.name = creds.username;
                res.status(200).json({ message: `welcome ${creds.username}` });
            } else {
                res.status(401).json({ message: 'Your username and/or password is invalid' });
            }
        })
        .catch(err => res.status(500).send(err));
});

server.get('/api/users', (req, res) => {
    db.getUsers()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch(err =>
            res.status(404).json({ message: 'Could not find users database' }))
});

const port = 8000
server.listen(port, console.log(`\n ===> Server is running on port ${port} <=== \n`))