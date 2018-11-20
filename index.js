const express = require('express')
const bcrypt = require('bcryptjs')
const knex = require('knex')
const knexConfig = require('./knexfile.js')
const db = knex(knexConfig.development)
const server = express();
server.use(express.json())

server.get('/', (req, res) => {
    res.send('im running')
})

server.listen(9000, () => console.log('server is running'))