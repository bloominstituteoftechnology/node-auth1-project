const express = require('express')

const apiRouter = require('./api.router')
const configureMiddleware = require('./middleware')

const server = express()

configureMiddleware(server)

server.use('/api', apiRouter)

server.use('/', (req, res) => {
    {res.status(200).json('Its Alive')}
})

module.exports = server