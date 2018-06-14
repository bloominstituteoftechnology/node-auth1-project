const express = require('express')
const mongoose = require('mongoose')

const userRouter = require('./userRouter.js')

const server = express()

mongoose.connect('mongodb://localhost/auth')
  .then(() => {
    console.log('Xerxes Mcwhiskers has intercepted Gerbilinidus, Gerbilinidus is no more.')
  })
  .catch(() => {
    console.log('Gerbilinidus has escaped, try looking behind the wall.')
  })
server.use(express.json())

server.use('/api', userRouter)

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Gerbilinidus running on wheel ${port}`)
})