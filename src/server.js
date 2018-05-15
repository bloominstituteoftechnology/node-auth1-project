const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const session = require('express-session')
const User = require('./models/user.js')
const errors = require('./errors.js')
const MongoStore = require('connect-mongo')(session)
const cors = require('cors')



mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n=== connected to mongo ===\n');
  })
.catch(err => console.log('error connecting to mongo', err));

const sessionConfig = {
  secret: 'shhhhhh',
  cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, //1 day in ms
  resave: true,
  httpOnly: true, 
  secure: false, 
  saveUninitialized: false,
  name: 'noneya', 
  store: new MongoStore({
    url: 'mongodb://localhost/sessions',
    ttl: 60 * 10,
  }),
};

const server = express()
server.use(session(sessionConfig))
server.use(express.json())
server.use(cors())

// Middlewares!
const userAuthenticated = (req, res, next) => req.session.username
  ? next()
  : next(errors.userNotLoggedIn)

// User Api
const api = express.Router()
server.use('/api', api)

api.post('/login', (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) next(errors.userLoginMissingFields)

  User.findOne({ username })
    .then(user => {
      console.log(user)
      if (!user) return next(errors.userNotFound) 
      bcrypt.compare(password, user.password)
        .then(result => {
          req.session.username = username
          res.send(user)
        })
    })
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
restricted.use(userAuthenticated)

restricted.get('/users', (req, res, next) => {
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