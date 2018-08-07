const db = require('../data/db')
const bcrypt = require('bcryptjs')

module.exports = {
  registerUser: (req, res, next) => {
    const { password } = req.body

    //* Hash password
    const hash = bcrypt.hashSync(password, 14)
    req.body.password = hash

    db('users')
      .insert(req.body)
      .then(user => {
        req.session.username = req.body.username
        res.status(201).json({ msg: 'Registration Successful!' })
      })
      .catch(next)
  },

  loginUser: (req, res, next) => {
    let { username, password } = req.body
    username = username.toLowerCase()

    db('users')
      .where({ username })
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
