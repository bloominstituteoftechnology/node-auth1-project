// import packages
const express = require('express')
const knex = require('knex')
const knexConfig = require('./knexfile')
const bcrypt = require('bcryptjs')
const session = require('express-session')
const connectKnexSession = require('connect-session-knex') // allows us to store session in db

// init server & database
const server = express()
const db = knex(knexConfig.development)

// handle sessions and cookies
const sessionConfig = {
  name: 'random name', 
  secret: 'random secret',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    secure: false
  },
  httpOnly: true,
  resave: false,
  saveUninitialized: false
}

server.use(session(sessionConfig))

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
      // compare input password with database's one
      if (user && bcrypt.compareSync(password, user.password)) {
        // save user in session
        req.session.username = user.username
        res.status(201).json({ message: `Logined successfully. Weclome back, ${req.session.username}` })
      } else {
        res.status(500).json({ message: 'Your input is invalid' })
      }
    })
    .catch(error => res.status(500).json({ message: error }))
})

// mocked api for logging out
server.get('/api/logout', (req, res) => {
  // if client has a session
  if (req.session) {
    // clear session
    req.session.destroy(error => {
      if (error) {
        res.status(500).json({ message: 'Logout unsuccessfully' })
      } else {
        res.status(201).json({ message: 'Logout successfully' })
      }
    })  
  }
})

// mocked api for accessing db by logged-in user
server.get('/api/users', (req, res) => {
  // if session and username are in session
  if (req.session && req.session.username) {
    db('login')
      .select()
      .then(users => {
        res.status(201).json(users)
      })
      .catch(error => res.status(500).json(error))
  } else {
    res.status(500).json({ message: 'no access' })
  }
})

const port = 3300

server.listen(port, () => {
  console.log(`server is listening on port ${port}`)
})