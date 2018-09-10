// import packages
const express = require('express')
const knex = require('knex')
const knexConfig = require('./knexfile')
const bcrypt = require('bcryptjs')

// init server & database
const server = express()
const db = knex(knexConfig.development)

server.use(express.json())

server.get('/', (req, res) => {
  res.send('server is up and running')
})

// mocked api for user registration
server.post('/api/register', (req, res) => {
  // capture request 
  const user = req.body
  // secure password by hashing 10 times
  const hashedPassword = bcrypt.hashSync(user.password, 10)
  // update password
  user.password = hashedPassword
  // store in db
  db('login')
    .insert(user)
    .then(ids => {
      const id = ids[0]
      res.status(201).json(id)
    })
    .catch(error => res.status(500).json({ message: error }))
})

// mocked api for user login
server.post('/api/login', (req, res) => {
  // capture request 
  const user = req.body
  const { username, password } = user
  // check database
  db('login')
    // see whether there is match in username
    .where({ username })
    .first()
    .then(user => {
      console.log(user)
      // compare input password with database's one
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(201).json({ message: 'Logined successfully' })
      } else {
        res.status(500).json({ message: 'Your input is invalid' })
      }
    })
    .catch(error => res.status(500).json({ message: error }))
})

const port = 3300

server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})