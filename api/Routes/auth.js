const server = require('express')()
const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')
const rateLimit = require('express-rate-limit')

// REGISTER
function registerUser (req, res, next) {
  console.log(req.body)
  const credentials = req.body
  credentials.password = bcrypt.hashSync(credentials.password, 10)
  console.log(credentials)
  db('users')
    .insert(credentials)
    .then((id) => {
      db('users')
        .where('id', id[0])
        .then((newUser) => {
          const user = newUser[0]
          req.session.username = user.username
          res.status(201).json({ ...user, ...req.session })
        })
        .catch(next)
    })
    .catch(next)
}
// GET USERS
const getUsers = (req, res, next) => {
  const { id } = req.params
  if (id) {
    db('users')
      .where({ id })
      .then((user) => {
        if (!user.length > 0) {
          next(new Error(`CANT_FIND`))
        }
        res.status(200).json(user)
      })
      .catch(next)
  } else {
    db('users').then((users) => res.status(200).json(users)).catch(next)
  }
}
// LOGIN
const login = (req, res, next) => {
  const credentials = req.body
  db('users')
    .where({ username: credentials.username })
    .first()
    .then((user) => {
      if (user || bcrypt.compareSync(credentials.password, user.password)) {
        req.session.username = user.username
        console.log(req.session)
        res.json({ msg: `welcome ${req.session.username}` })
      } else {
        return res.status(401).json({ error: 'Incorrect credentials' })
      }
    })
    .catch(next)
}
// restricted
const restricted = (req, res, next) => {
  console.log('IN RESTRICTED', req.session)
  if (req.session.username) {
    res.status(200).send('Premium Content')
  } else {
    res.status(500).send('error')
  }
}

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 2, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after an hour'
})
// Register
server.post('/register', createAccountLimiter, registerUser)
// GET USERS
server.get('/users', getUsers)
// LOGIN
server.post('/login', login)
// Restricted
server.get('/restricted', restricted)
module.exports = server
