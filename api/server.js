const express = require('express')

const apiRouter = require('./api.router')

const server = express()

//bring in middleware, then configure it to server
const configureMiddleware = require('./middleware')
configureMiddleware(server)

server.use('/api', apiRouter)

server.use('/', (req, res) => {
    {res.status(200).json('Its Alive')}
})

module.exports = server