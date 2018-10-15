const express = require('express')
const server = express()
const userRouter = require('./data/routers/userInfoRouters.js')
const cors = require('cors')
const port = 7777

server.use(express.json())
server.use(cors())
server.use('/api', userRouter)

server.listen(port, err => {
    if(err) console.log(err)
    console.log(`Server Running on port: ${port}`)
})