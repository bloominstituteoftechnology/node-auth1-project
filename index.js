const express = require('express')

const server = express()
server.use(express.json())

//Route
const authRoute = require('./data/routes/authRoute')
const usersRoute = require('./data/routes/authRoute')

server.use('/api/', authRoute)
server.use('/api/users', usersRoute)

//Listening
const port = 3300
server.listen(port, () => {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
})