const express = require('express')
const helmet = require('helmet')
const cors = require("cors")


const server = express()
const port = process.env.PORT || 4500

server.use(cors())
server.use(helmet())
server.use(express.json())

server.get("/", (req, res, next) => {
    res.json({
        message: "Welcome to our API",
    })
})

server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong",
    })
})

server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`)
})