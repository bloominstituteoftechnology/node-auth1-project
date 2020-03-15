const express = require('express')
const helmet = require('helmet')
const cors = require("cors")
const session = require('express-session')
const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")


const server = express()
const port = process.env.PORT || 4500

const sessionConfig = {
    name: 'banana', // name of the cookie.
    secret: "Logged in!", //secret is what we use to encrypt and decrypt the cookie.
    cookie: {
        maxAge: 1000 * 30, //the cookie and in turn the session will be valid for 30 seconds. After that it'll be expired.
        secure: false, // 
        httpOnly: true, // no javascript on the client end will have access to cookie.
    },
    resave: false,
    saveUninitialized: false, // GDPR laws against setting cookies automatically
}

server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(session(sessionConfig))

server.use("/auth", authRouter)
server.use("/users", usersRouter)

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

server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})