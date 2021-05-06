const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const db = require("../data/db-config")
const usersRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")

const server = express()

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
  resave: false,
  saveUninitialized: false,
  secret: "chocolatechip",
  store: new KnexSessionStore({
    knex: db,
    createtable: true,
  }),
  name: 'chocolatechip'
}))

server.use(authRouter)
server.use(usersRouter)


server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
