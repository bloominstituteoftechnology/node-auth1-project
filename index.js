const express = require('express');
const helmet = require('helmet');
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = require('./database/dbConfig');

const server = express();
const port = 8000;

const sessionConfig = {
    secret: "only.i3now!this.pass0wd",
    name: "hahaha",
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 1
    },
    store: new KnexSessionStore({
        tablename: "session",
        sidfieldname: "sid",
        knex: db,
        createtable: true,
        clearInterval: 1000 * 60 * 10
    })
};

server.use(session(sessionConfig));
server.use(helmet(), express.json());

const protected = (req, res, next) => {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send("Not authorized");
    }
};

server.get('/', (req, res) => {
    res.send('<h1>Live Server</h1>')
});

server.get('/api/users', protected, (req, res) => {
    db('users').select('id', 'username').then(users => res.json(users)).catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
    const creds = req.body;

    // Has the password
    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    // Save the user to the database
    db('users').insert(creds).then(ids => {
        const id = ids[0];
        req.session.username = creds.username;
        res.status(201).json({newUserId: id});
    }).catch(err => res.status(500).send(err));
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users').where({ username: creds.username }).first().then(user => {
        if(user && bcrypt.compareSync(creds.password, user.password)) {
            req.session.username = user.username;
            res.status(200).json({ welcome: user.username });
        } else {
            res.status(401).json({ message: 'You shall not pass!' });
        }
    }).catch(err => res.status(500).json(err));
});

server.get('/api/logout', (req , res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                res.send(err);
            } else {
                res.send('User left');
            }
        });
    }
});

server.get('/api/restricted/fun', protected, (req, res) => {
    res.status(200).send('Welcome, to The Fun House!');
})

function runServer() {
    console.log('\x1b[34m', `\n[server] started server`);
    console.log(`[server] running on port: ${port}\n`);
    console.log('\x1b[0m', '');
}

server.listen(port, runServer());