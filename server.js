const express = require('express');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session');

const db = require('./data/db-config');

const Users = require('./users/users-model');
const UsersRouter = require('./users/users-router');
const protected = require('./users/users-middleware/protected');

const sessionConfig = {
    name: 'dogfather',
    secret: 'Dog spells God backwards.',
    cookie: {
        httpOnly: true, // No cookies in JS for security reasons
        maxAge: 1000 * 60 * 60, // Cookie only valid for 1 hour
        secure: false, // Change to "true" during production
    },
    resave: false, // To prevent excessive churning
    saveUninitialized: true, // False during production (or you get sued)
};

const server = express();

server.use(sessions(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', UsersRouter)

server.post('/api/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    if (user) {
        Users.add(user)
            .then(newUser => res.status(201).json(newUser))
            .catch(err => res.status(500).json(err))
    } else {
        res.status(400).json({ message: 'Please provide a valid username and password' })
    }
})

server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
    console.log('session from server ', req.session);

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    req.session.username = user.username;
                    res.status(200).json({ message: `Welcome ${user.username}` })
                } else {
                    res.status(401).json({ message: 'Invalid credentials' })
                }
            })
            .catch(err => res.status(500).json(err))
    } else res.status(400).json({ message: 'Please provide valid credentials '})
})

server.get('/api/protected', protected, (req, res) => {
    Users.protectedPage()
    .then(secret => res.json('You accessed the secret page'))
    .catch(err => res.status(500).json({ message: 'You are not allowed in here' }))
})

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.status(200).json({ message: 'Successfully logged out' })
    } else {
        res.status(200).json({ message: 'You are already logged out' })
    }
})

module.exports = server;