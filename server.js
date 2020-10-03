const express = require('express')
const helmet = require('helmet')

const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require("connect-session-knex")(session)
const server = express();
const errorHandler = require('./errorHandler')

const userRouter = require('./user-router/userRouter')

const db = require('./database/config')



const sessionConfig = {
    name:'scookie',
    secret:'its a secret',
    cookie: {
        maxAge: 60 * 60* 1000,
        secure:false,
        httpOnly: true
    },
    resave:false,
    saveUninitialized:false
}
server.use(helmet());

server.use(express.json());

// server.use(cors());


server.use("/api", userRouter)
server.get("/", (req,res) => {
    res.json({api: "up"})
});

server.use(errorHandler)

module.exports = server

