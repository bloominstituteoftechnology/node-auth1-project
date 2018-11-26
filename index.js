const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const port = 8000

const db = require('./data/dbConfig.js')
const server = express()

server.use(express.json())
server.use(cors)



server.listen(port, () => console.log(`Server is active on port ${port}`))
