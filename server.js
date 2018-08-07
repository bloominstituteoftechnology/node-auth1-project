require('dotenv').config()

const server = require('express')()
const errorHandler = require('./errorHandler')

//* Middleware & Routes
require('./middleware')(server)
require('./routes')(server)

//* Error Handler
server.use(errorHandler)

const port = process.env.PORT || 8080

//* "Sanity Check"
server.get('/', (req, res) => {
  res.status(200).send(' 🇳🇮 Server Listens and Obeys 🤦‍♂')
})

server.listen(port, () => {
  console.log(`\n 💩  === SERVER ONLINE on port ${port} === 🦄 \n`)
})
