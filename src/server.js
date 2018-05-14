const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user.js')
const Token = require('./models/token.js')
const errors = require('./errors.js')

const server = express()
server.use(express.json())

function userAuthenticated(req, res, next) {
  const { token } = req.headers
  if (token) {
    Token.findById(token)
      .then(token => {
        if (token.isValid()) {
          next()
        } else {
          next(errors.userTokenExpired)
        }
      })
  } else {
    next(errors.userNotLoggedIn)
  }  
}

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
      bcrypt.compare(password, user.password)
        .then(hash => {
          Token.create({ userId: user._id })
            .then(token => res.send({
              user: user,
              token: token._id
            }))
        })
    })
})

server.post('/api/register', (req, res, next) => {
  if (!req.body.username) { next(errors.userRegisterMissingName) }
  if (!req.body.password) { next(errors.userRegisterMissingPassword) }
  if (req.body.password.length < 7) { next(errors.userRegisterInvalidPassword)}

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