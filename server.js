const express = require('express');
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const configureMiddleware = require('./config-mid');
const router = require('./router');
const authRouter = require('./authRouter')

const server = express();


const sessionConfig = {
    name: "cookieMonster",
    // secret is used for cookie encryption
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    cookie: {
        maxAge: 1000 * 60 * 10, // 10 minutes in ms
        secure: false, // set to true in production, only send cookies over HTTPS
        httpOnly: true, // JS cannot access the cookies on the browser
    },
    resave: false,
    saveUninitialized: true, // read about it for GDPR compliance
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 60000,
    }),
};






configureMiddleware(server);
server.use(session(sessionConfig));

server.use('/api', router);
server.use('/api', authRouter);

module.exports = server;