const server = require('express')()
const db = require('../../data/dbConfig')
const bcrypt = require('bcryptjs')

function registerUser (req, res, next) {
  const credentials = req.body

  const hash = bcrypt.hashSync(credentials.password, 14)
  credentials.password = hash

  db
    .insert(credentials)
    .into('users')
    .then((users) => {
      const id = users[0]
      db('users')
        .where('id', id)
        .then((user) => res.status(201).json(user))
        .catch(next)
    })
    .catch(next)
}
// GET USERS
function getUsers (req, res, next) {
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
// Register
server.post('/register', registerUser)
// GET USERS
server.get('/users', getUsers)

module.exports = server
