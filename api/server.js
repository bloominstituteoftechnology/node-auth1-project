const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session);

const authRouter = require("../auth/auth-router.js");
const usersRouter = require('../users/users-router');
const knexConnection = require('../database/db.Config');

const server = express();
const sessionConfiguration = {
    name: 'sunshine',
    secret: process.env.COOKIE_SECRET || "is it secret? is it safe?",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        clearInterval: 1000 * 60 * 10,
        tablename: 'user_sessions',
        sidfieldname: 'id',
        createtable: true
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));

server.use("/api/auth", authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.json({ api: '"up', session: req.session });
});

module.exports = server;