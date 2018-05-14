const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
const User = require('./models/user.js')
const errors = require('./errors.js')

const server = express()
server.use(session({
  secret: 'shhhhhh',
  resave: false,
  saveUninitialized: false
}))
server.use(express.json())

const userAuthenticated = (req, res, next) => req.session.username
  ? next()
  : next(errors.userNotLoggedIn)

server.get('/api/users', userAuthenticated, (req, res, next) => {
  User.find()
    .then(users => res.send(users))
    .catch(() => next(errors.usersFetch))
})

server.post('/api/login', (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) { next(errors.userLoginMissingFields) }

  User.findOne({ username })
    .then(user => {
      if (!user) next(errors.userNotFound) 
      bcrypt.compare(password, user.password)
        .then(result => {
          req.session.username = username
          res.send(user)
        })
    })
})

server.get('/api/logout', (req, res, next) => {
  if (!req.session.username) next(errors.userNotLoggedIn)
  req.session.username = null
  res.send('Logged out')
})

server.post('/api/register', (req, res, next) => {
  if (!req.body.username) next(errors.userRegisterMissingName)
  if (!req.body.password) next(errors.userRegisterMissingPassword)
  if (req.body.password.length < 7) next(errors.userRegisterInvalidPassword)

  const user = new User(req.body)
  user.save()  
    .then(user => res.send(user))
    .catch(err => next({ status: 500, error: err }))
})

server.use(({ status, error }, req, res, next) => {
  console.log(error)
  res.status(status).send({ error })
}) 

mongoose.connect('mongodb://localhost/auth')
  .then(() => {
    server.listen(5000, () => console.log('listening on 5000'))
  })