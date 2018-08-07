const db = require('../data/db')
const bcrypt = require('bcryptjs')

module.exports = {
  registerUser: (req, res, next) => {
    db('users')
      .insert(req.body)
      .then(user => res.status(201).json({ msg: 'Registration Successful!' }))
      .catch(err => res.status(500).json(err))
  },

  loginUser: (req, res, next) => {
    let { username, password } = req.body
    db('users').where({ username })
      .then(user => {
        bcrypt.compare(password, user[0].password)
          .then(isPasswordValid => {
            if (isPasswordValid) {
              return res.status(200).json({ msg: 'Login Successful!' })
            } else {
              return res.status(403).json({ msg: 'Login Failed!' })
            }
          })
      })
      .catch(err => res.status(501).json(err))
  }
}
