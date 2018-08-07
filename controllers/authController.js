const db = require('../data/db')
const bcrypt = require('bcryptjs')

module.exports = {
  registerUser: (req, res, next) => {
    db('users')
      .insert(req.body)
      .then(user => res.status(201).json({ msg: 'Registration Successful!' }))
      .catch(next)
  },

  loginUser: (req, res, next) => {
    let { username, password } = req.body
    db('users').where({ username })
      .then(user => {
        bcrypt.compare(password, user[0].password)
          .then(isPasswordValid => {
            if (isPasswordValid) {
              return res.status(200).json({ msg: 'login successful' })
            } else {
              return res.status(401).json({ msg: 'login failed' })
            }
          })
      })
      .catch(next)
  }
}
