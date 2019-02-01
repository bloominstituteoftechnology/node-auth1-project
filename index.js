const express = require('express')

const knex = require('knex')
const knexConfig = require('./knexfile')
const db = knex(knexConfig.development)

const PORT = 5100
const server = express()
server.use(express.json())

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})