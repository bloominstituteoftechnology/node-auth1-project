const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const server = express()
const db = require('./db/helpers')

server.use(express.json)
server.use(helmet())

server.get('/', (req, res) => {
    res.send('working')
})

const port = 8000
server.listen(port, console.log(`\n ===> Server is running on port ${port} <=== \n`))