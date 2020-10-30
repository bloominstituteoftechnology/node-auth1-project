const express = require('express')

const server = express()

const usersRouter = require("./users/users-router")
server.use(usersRouter)
server.use(express.json())
const port = process.env.PORT || 5000

server.listen(port, () => {
    console.log('server running on 5000')
})