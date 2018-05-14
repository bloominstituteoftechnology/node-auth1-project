const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/user.js')

const server = express()
server.use(express.json())

function authenticate(req, res, next) {
  const { username, password } = req.body
  if (!username || !password) { next('Please provide a username and password') }

  User.findOne({ username })
    .then(user => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          next(err)
        }
        if (result) {
          res.user = user
          next()
        } else {
          res.status(401).send('Access Denied')
        }
      })
    })
}

server.post('/api/users', authenticate, (req, res, next) => {
  User.find()
    .then(users => res.send(users))
    .catch(() => next('Unable to fetch users'))
})

server.post('/api/login', authenticate, (req, res, next) => {
  res.status(200).send(res.user)
})

server.post('/api/register', (req, res, next) => {
  if (!req.body.username) { next('Please provide a username') }
  if (!req.body.password) { next('Please provide a password') }
  if (req.body.password.length < 7) { next({ error: 'Please provide a password with 7 or more characters' })}

  const user = new User(req.body)
  user.save()  
    .then(user => res.send(user))
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
})

server.use((error, req, res, next) => {
  console.log(error)
  res.send({ error })
}) 

mongoose.connect('mongodb://localhost/auth')
  .then(() => {
    server.listen(5000, () => console.log('listening on 5000'))
  })