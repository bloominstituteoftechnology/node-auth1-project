const express = require('express')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
    res.json('up and running')
})

module.exports = server