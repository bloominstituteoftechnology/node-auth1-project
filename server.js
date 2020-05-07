const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const restricted = require("./middleware/restrict");
const dbConnection = require("./data/dbConfig");
const KnexSessionStore = require("connect-session-knex")(session)

const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/user-router")

const server = express()

const sessionConfig = {
    name: "almondMilk",
    secret: process.env.SESSION_SECRET || "CONFIDENTIAL",
    cookie: {
        maxAge: 1000 * 60 * 10,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConnection,
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 60000
    })
};




server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(session(sessionConfig))

server.use("/auth", authRouter)
server.use("/users", restricted, usersRouter)

server.get("/", (req, res, next) => {
    res.json({
        message: "Welcome to our API",
    })
})

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong",
    })
})


module.exports = server