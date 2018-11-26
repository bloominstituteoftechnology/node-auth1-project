const bcrypt = require('bcryptjs')
const express = require('express')
const knex = require('knex')
const knexConfig = require('./knexfile')
db = knex(knexConfig.development)
const server = express()

server.use(express.json())



server.get('/', (req, res) => {
    res.send({message: "API is running"})
})














const port = 6000;

server.listen(port, () => console.log(`\n Running on port: ${port} \n`));