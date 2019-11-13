const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStorage = require('connect-session-knex')(session);
const apiRouter = require('./api-router');
const configureMiddleware = require('./configure-middleware.js');

const authRouter = require('./auth/auth-router.js');
const usersRouter = require('./users/users-router.js');
const knexConnection = require('./db-config.js');

const server = express();

const sessionsConfiguration = {
    name: "sid",
    secret: process.env.COOKIE_SECRET || "is it kept secret?",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        clearInterval: 1000 * 60 * 10,
        tablename: "user_sessions",
        sidfieldname: "id",
        createtable: true
    })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionsConfiguration));

server.use('./api/auth', authRouter);
server.use('./api/users', usersRouter)

configureMiddleware(server);

server.use('/api', apiRouter);

server.get("/", (req, res) => {
    res.json({ api: "up", session: req.session });
  });

module.exports = server;