const express = require('express');
const server = express();
const usersRouter = require('./users/users-router')
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session)
const db = require('./data/dbConfig')

server.use(express.json());
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'bah weep grana weep ninny bon',
    store: new knexSessionStore({
        knex: db,
        createtable: true,
    })
}))

server.use('/api', usersRouter);

module.exports = server;