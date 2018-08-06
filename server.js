require('dotenv').config()

const server = require('express')()

require('./middleware')(server)
require('./routes')(server)

const port = process.env.PORT || 8080

server.get('/', (req, res) => {
  res.status(200).send('Server Listens and Obeys')
})

server.post('/')
server.listen(port, () => {
  console.log(`\n === SERVER ONLINE on port ${port} ===\n`)
})
