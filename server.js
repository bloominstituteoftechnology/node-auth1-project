const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const userController = require('./user/userController')
const loginController = require('./user/loginController')
const logoutController = require('./user/logoutController')
const protectedController = require('./user/protectedController')
const server = express()
const sessionOptions = {
  secret: 'central perk',
  cookie: {
    maxAge: 1000 * 60 * 60 // an hour *24 day
  },
  httpOnly: true,
  secure: false, // https
  resave: true,
  saveUninitialized: true,
  name: 'no-name'
}

server.use(express.json())
server.use(cors())
server.use(session(sessionOptions))

mongoose.connect('mongodb://localhost/adfarisUser').then(() => {
  console.log('Connected to Mongo')
})

server.use('/api/register', userController)
server.use('/api/login', loginController)
server.use('/api/users', userController)
server.use('/api/logout', logoutController)
server.use('/api/protected', protectedController)

server.get('/', (req, res) => {
  if (req.session && req.session.username) {
    res.status(200).json({ message: `welcome back ${req.session.username}` })
  } else {
    res.status(401).json({ message: 'speak friend and enter' })
  }
})
server.listen(8500, () => console.log('\n API running on port 8.5K\n'))
