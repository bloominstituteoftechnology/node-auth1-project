const express = require("express");
const session = require('express-session')
const knexSessionStore = require('connect-session-knex')(session);
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require('../user/user-router.js')

const server = express()

const sessionConfig = {
    name: 'anyNameforSession',
    secret: 'AnySecret',
    cookie: {
        maxAge: 60000, //Milliseconds
        secure: false, // should be true in production
        httpOnly: true //only for Http use
    },
    resave: false,
    saveUninitialized: false,

    //Configuration to store session in Database using knex
    store: new knexSessionStore(
        {
            knex: require('../data/dbConfig.js'),
            tablename: "sessions",
            sidfieldname: "sid",
            createtable: true,
            clearInterval: 60000
        }
    )
}

server.use(helmet());
server.use(express.json());
server.use(cors());
//Use Session
server.use(session(sessionConfig));

server.use('/api/users', userRouter)

server.get("/", (req, res) => {
    res.send('Server is Running...');
});

module.exports = server;