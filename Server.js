const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const User = require('./User')

const server = express()

mongoose.connect('mongodb://localhost/auth-i')
  .then(() => {
    console.log('\n === Database Connected ===\n')
    server.listen(5000, () => {
      console.log('\n === Server Listening on Port 5000 === \n')
    })
  })
  .catch(err => console.log(err))

const wakeUp = (req, res, next) => {
  req.message = 'Good morning GD and JC...'
  next()
}

const checkAuthorization = (req, res, next) => {
  const {session} = req

  if (session && session.isLoggedIn) {
    console.log('before next', req.session)
    return next()
  } else {
    res.status(401).json({msg: 'You must login first.  Please login.'})
  }
}

server.use(express.json())
server.use(session({secret: 'A very secret key'}))
server.use(wakeUp)
server.get('/', (req, res) => {
  res.status(200).json({msg: 'Connected to server'})
})

server.post('/api/register', (req, res) => {
  const user = new User(req.body)
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).send(err))
})

server.get('/api/users', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).send(err))
})

server.put('/api/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400)
  }

  const {username, password} = req.body

  User.findOne({username})
    .then(user => {
      user.comparePassword(password, isMatch => {
        if (isMatch) {
          req.session.isLoggedIn = true
          req.session.username = user.username
          res.status(200).json({msg: 'Logged In!'})
        } else {
          res.status(401).json({msg: 'Sorry not authorized'})
        }
      })
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

server.get('/protectedRoute', checkAuthorization, (req, res) => {
  res.status(200).json({msg: 'Authorized!'})
})

