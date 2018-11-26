const express = require('express')
const knex = require('knex')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const port = 8000

const server = express()

server.use(express.json())
server.use(cors)

server.listen(port, () => console.log(`Server is active on port ${port}`))
