const express = require('express')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.status(200).send('Alive and well')
})

server.listen(3000, () => {console.log('\n==== Server Running on port 3000! ====\n')})