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
      .then(id => {
        req.session.username = req.body.username
        res
          .status(201)
          .json({ msg: 'Registration Successful!', ...req.session, id: id[0] })
      })
      .catch(next)
  },

  loginUser: (req, res, next) => {
    let { username, password } = req.body
    username = username.toLowerCase()

    db('users')
      .where({ username })
      .first()
      .then(user => {
        bcrypt.compare(password, user.password).then(isPasswordValid => {
          if (isPasswordValid) {
            req.session.username = user.username
            res.status(200).json({ msg: 'login successful', ...req.session })
          } else {
            res.status(401).json({ msg: 'login failed' })
          }
        })
      })
      .catch(next)
  },

  logoutUser: (req, res, next) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('you can never leave')
        } else {
          res.send('bye')
        }
      })
    } else {
      res.end()
    }
  }
}
