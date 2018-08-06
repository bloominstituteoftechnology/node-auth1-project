const router = require('express').Router()
const bcrypt = require('bcrypt')
const db = require('../../data/db')

//* Middleware
const sendUserError = (err, res) => {
  res.status(400)
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack })
  } else {
    res.json({ error: err })
  }
}

const checkAndLowerCaseUsername = (req, res, next) => {
  console.log('in check and lower')
  const { username } = req.body
  if (!username || !username.trim() || username.length > 20) {
    return sendUserError('Must enter a username (20 max char)', res)
  }
  req.body.username = username.toLowerCase()
  next()
}

const checkAndHashPassword = (req, res, next) => {
  console.log('in check and hash')
  const { password } = req.body
  if (!password || !password.trim() || password.length > 20) {
    return sendUserError('Must enter a password (20 max char)', res)
  }
  bcrypt.hash(password, 14, (err, hash) => {
    if (err) {
      return next(err)
    }
    req.body.password = hash
    console.log('hash and password', req.body, hash)
    next()
  })
}

//* Routes
router.post('/login', (req, res) => {
  let { username, password } = req.body
  username = username.toLowerCase()
  console.log('username and password in login', username, password)
  db('users').where('username', username)
    .then(user => {
      console.log('About To Crypt')
      console.log(password, user[0].hashPassword)
      bcrypt
        .compare(password, user[0].hashPassword)
        .then(isPasswordValid => {
          if (isPasswordValid) {
            return res.status(200).json({ msg: 'Login Successful!' })
          } else {
            return res.status(403).json({ msg: 'Login Failed!' })
          }
        })
        .catch(err => res.status(500).json(err))
    })
    .catch(err => res.status(501).json(err))
})

router.post('/register',
  checkAndLowerCaseUsername,
  checkAndHashPassword,
  (req, res) => {
    console.log('in register post', req.body)
    const { username, password } = req.body
    const hashPassword = password
    db('users')
      .insert({ username, hashPassword })
      .then(user => res.status(201).json({ msg: 'Registration Successful!' }))
      .catch(err => res.status(500).json(err))
  }
)

module.exports = router
