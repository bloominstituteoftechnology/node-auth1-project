const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const ConnectSessionKnex = require("connect-session-knex")(session)
const usersRouter = require("./users/users-router")
const db = require("./data/config")

const server = express()
const port = process.env.PORT || 9000

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "keep dat thang secret", 
    store: new ConnectSessionKnex({
        knex: db,
        createtable: true,
    })
}))

server.use(usersRouter)

server.use((err, req, res, next) => {
    console.log(err)

    res.status(500).json({
        message: "Something went wrong",
    })
})

server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})