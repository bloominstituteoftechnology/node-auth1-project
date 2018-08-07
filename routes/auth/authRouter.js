const router = require('express').Router()
const bcrypt = require('bcryptjs')
const {loginUser, registerUser} = require('../../controllers/authController')

//* Custom Middleware
const validateUsername = (req, res, next) => {
  const { username } = req.body
  if (!username.trim() || username.length > 20) {
    return next(new Error('username is required (max 20 char)'))
  }
  req.body.username = username.toLowerCase()
  next()
}

const validatePassword = (req, res, next) => {
  const { password } = req.body
  if (!password.trim() || password.length > 20) {
    return next(new Error('password is required (20 max char)'))
  }

  //* Hash password
  bcrypt
    .hash(password, 14)
    .then(hash => {
      req.body.password = hash
      next()
    })
    .catch(next)
}

//* Routes
router.post('/login', loginUser)

router.post('/register',
  validateUsername,
  validatePassword,
  registerUser
)

module.exports = router
