//dependencies
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const restricted = require('../auth/restricted-middleware');

//routers
const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');

//server object
const server = express();
const sessionConfig = {
    name: 'sksession',
    secret: 'secretshae',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false, // true in production
        httpOnly: true
    },

    resave:false,
    saveUninitialized: false,

    store: new knexSessionStore(
        {
            knex: require('../database/connection.js'),
            tablename: 'sessions',
            sidfieldname: 'sid',
            createtable: true,
            clearInterval: 1000 * 60 * 60
        }
    )
}

//global middleware
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('api/users', restricted, usersRouter);
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.json({
        api: 'up'
    });
});

module.exports = server;