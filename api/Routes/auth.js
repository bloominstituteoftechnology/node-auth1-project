const server = require('express')()
const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')
// REGISTER
function registerUser (req, res, next) {
  const credentials = req.body
  credentials.password = bcrypt.hashSync(credentials.password, 10)

  db('users')
    .insert(credentials)
    .then((users) => {
      const id = users[0]
      db('users')
        .where('id', id)
        .then((newUser) => {
          console.log('in register', newUser[0])
          const user = newUser[0]
          req.session.username = user.username
          console.log('in register', req.session.username)
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
// Register
server.post('/register', registerUser)
// GET USERS
server.get('/users', getUsers)
// LOGIN
server.post('/login', login)
// Restricted
server.get('/restricted', restricted)
module.exports = server
