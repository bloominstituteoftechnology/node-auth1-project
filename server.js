const express = require('express');
const server = express();
const userRouter = require('./UserStuff/userRouter')
const session = require('express-session');
const knexSessionStorage = require('connect-session-knex')(session);

const sessionConfiguration = {
    name: 'bugger',
    secret: process.env.COOKIE_SECRET || 'is it secret? is it safe?',
    cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour 
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new knexSessionStorage({
        clearInterval: 1000 * 60 * 10, //10 minutes
        tablename: "user_sessions",
        sidfieldname: "id",
        createtable: true
    })
}


server.use(express.json());
server.use(session(sessionConfiguration));
server.use('/api/', userRouter);

module.exports = server;