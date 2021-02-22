const express = require("express");
const session = require('express-session')
const loginRouter = require("./login/router");
const usersRouter = require("./users/router");
const registerRouter = require("./register/router");

const server = express();

const sessionConfig = {
    name:'no-session',
    secret: 'keep it secret keep it safe',
    cookie:{
        maxAge: 60 * 60 * 1000,
        secure: false ,//true in production
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}


server.use(express.json(),session(sessionConfig));
server.use("/api/login", loginRouter);
server.use("/api/users", usersRouter);
server.use("/api/register", registerRouter);

module.exports = server;
