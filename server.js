const express = require('express')
const session = require('express-session')

const userRouter = require('./users/users-router')

// secure to true for https - true for production
const sessionConfig = {
    name: 'doubleChocolateChip',
    secret: 'extra chocolate',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false
}

const server = express()

server.use(express.json())
server.use(session(sessionConfig))

server.use('/api/user', userRouter)

module.exports = server