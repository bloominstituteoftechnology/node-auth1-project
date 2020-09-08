const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const usersRouter = require('./users/users-router')
const server = express()
const port = process.env.PORT || 6936

server.use(helmet())
server.use(cors())
server.use(express.json())
server.use(usersRouter)

server.use((err, req, res, next) => {
    console.log(err)

    res.status(500).json({
        message: "something went wrong"
    })
})

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})