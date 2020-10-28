const express = require("express")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)
const userRouter = require("./users/user-router")
const db = require("./data/config")
 
const server = express()
const port = 5000

server.use(express.json())
server.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "secret squirrel stuff",
    store: new KnexSessionStore({
        knex: db,
        createtable: true
    })
}))

server.use('/api',userRouter)

server.use((er,req,res,next) => {
    console.log(er)

    res.status(500),json({
        message: "Server side error"
    })
})

server.listen(port, ()=> {
    console.log(`Running on gttp://localhost:${port}`)
})