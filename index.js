const express = require('express')
const bcrypt = require('bcryptjs')
const mwConfig = require('./data/mwConfig')
const db = require('./data/dbConfig.js')
const session = require('express-session')

const PORT = 9090
const server = express()
server.use(express.json())
server.use(session(sessionConfig))
mwConfig(server)

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })