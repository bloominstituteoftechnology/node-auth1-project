const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const Users = require('./users/user-model');
const router = require('./users/user-router');

const server = express();

server.use(express.json());

server.use(session({
    name: "monkey",
    secret: "keep it secret, keep it safe",
    cookie: {
        maxAge: 1000 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
        knex: require('../data/dbConfig'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createTable: true,
        clearInterval: 1000 * 60 * 60,
    }),
}));

server.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = bcrypt.hashSync(password, 10);
        const user = { username, password: hash, role: 2 }
        const addUser = await Users.add(user)
        res.status(201).json(addUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    };
});

server.post('/api/login', async (req, res) => {
    try {
        const [user] = await Users.findBy({ username: req.body.username });
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            req.session.user = user;
            res.json({ message: 'welcome!' });
        } else {
            res.status(401).json({ message: 'invalid credentials '});
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    };
});

server.get('/api/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy(err => {
            if (err) {
                res.json({ message: 'server error' });
            } else {
                res.json({ message: 'Goodbye!' }).end();
            }
        })
    }
})

server.use('/api/users', router);

module.exports = server;