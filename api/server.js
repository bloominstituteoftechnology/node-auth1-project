const express = require('express')

const accountRouter = require('./api.router')

const server = express()

server.use(express.json())
server.use('/api', accountRouter)
server.use('/', (req, res) => {
    {res.status(200).json('Its Alive')}
})

module.exports = server