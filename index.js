const express = require('express');
const sessionConfig = {
    name: 'notsession', // default connect.sid
    secret: `I can't tell you that`,
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // a day
        secure: true, // only set cookies over https. Server will not send back a cookie over http
    },
    httpOnly: true, // don't let 35 code access cookies. Browser extensions run 35 code on your browser
    resave: false,
    saveUninitialized: false,
};

const bcrypt = require('bcryptjs');
const server = express()
const db = require('./db/helpers')

server.use(express.json)
server.use(helmet());
server.use(session(sessionConfig))

server.get('/', (req, res) => {
    res.send('working')
})

server.post('/api/register', (req, res) => {
});

server.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.username = user.username;

                res.status(200).send({ message: `Welcome ${req.session.username}` })
            } else {
                res.status(401).json({ errMessage: 'Your username and/or password is invalid' });
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get('/setname', (req, res) => {
    req.session.name = 'Some User';
    res.send('got it');
});

server.get('/greet', (req, res) => {
    const name = req.session.name;
    res.send('hello ${req.session.name}');
})

server.get('/api/users', (req, res) => {
});

const port = 8000
server.listen(port, console.log(`\n ===> Server is running on port ${port} <=== \n`))