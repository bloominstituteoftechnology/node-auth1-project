const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user')
const errors = require('./errors')
const cors = require('cors')
const { passport, makeToken } = require('./auth')

const server = express()
server.use(express.json())
server.use(cors())
server.use(passport.initialize())

const passportOptions = { session: false }
const authenticate = passport.authenticate('local', passportOptions)
const authorize = passport.authenticate('jwt', passportOptions)

// User Api
const api = express.Router()
server.use('/api', api)

api.post('/login', authenticate, (req, res, next) => {
  const { user } = req
  res.send({ user, token: makeToken(user) })
})

api.get('/logout', (req, res, next) => {
  if (!req.session.username) next(errors.userNotLoggedIn)
  req.session.destroy();
  res.send('Logged out')
})

api.post('/register', (req, res, next) => {
  if (!req.body.username) next(errors.userRegisterMissingName)
  if (!req.body.password) next(errors.userRegisterMissingPassword)
  if (req.body.password.length < 7) next(errors.userRegisterInvalidPassword)
  
  const user = new User(req.body)
  user.save()  
  .then(user => res.send(user))
  .catch(err => next({ status: 500, error: err }))
})

// Restricted section of user api
const restricted = express.Router()
api.use('/restricted', restricted)

// Use authentication middleware for all requests to this router
// restricted.use(authorize)

restricted.get('/users', authorize, (req, res, next) => {
  User.find()
  .then(users => res.send(users))
  .catch(() => next(errors.usersFetch))
})

// Catch-all error handler
server.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send({ error })
}) 

mongoose.connect('mongodb://localhost/auth')
  .then(() => {
    server.listen(5000, () => console.log('listening on 5000'))
  })
