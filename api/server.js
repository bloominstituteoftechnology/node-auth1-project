const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

// to persist session
const KnexSessionStore = require('connect-session-knex')(session)

const userRouter = require('./users/user-router');
const authRouter = require('./auth/auth-router');

const server = express();

const config = {
    name: 'sessionID',
    secret: 'I will never tell!',
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false, // should be true in production
        httpOnly: true, // cannot access cookie via js
    },
    resave: false,
    saveUninitialized: false,

    //to persist sessions on server reload
    store: new KnexSessionStore({
        knex: require('../users/connection'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 10,
    }),
};

server.use(session(config))
server.use(helmet());
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api', authRouter);

server.get('/' , (req, res) => {
    res.json({ api: 'up and running'})
});

server.get('*', (req, res) => {
    res.status(400).json({ message: 'Not Found'})
});

module.exports = server;


