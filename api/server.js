const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session')// step 1 install express-session
const KnexSessionStorage = require('connect-session-knex')(session); 

const apiRouter = require('./api-router.js')
const configureMiddleware = require('./configure-middleware.js')
const knexConnection = require('../database/dbConfig')

const server = express();

const sessionConfiguration = {
    name: 'SID',
    secret: process.env.COOKIE_SECRET || 'My secret!',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStorage({
        knex: knexConnection,
        clearInterval: 1000 * 60 * 10,
        tablename: 'user_sessions',
        sidfieldname: 'id',
        createtable: true,
    })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfiguration));

configureMiddleware(server)

server.use('/api', apiRouter);

module.exports = server;