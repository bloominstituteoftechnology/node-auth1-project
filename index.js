const express = require('express')
const apiRoute = require('./api')

const port = process.env.PORT || 5000;

const server = express()
server.use(express.json())

//routes
server.use('/api', apiRoute)


server.listen(port, () => {
  console.log(`Listening at port: ${port}`)
})
