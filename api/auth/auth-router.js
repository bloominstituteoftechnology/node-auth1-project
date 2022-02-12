// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const User = require('../users/users-model')
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
} = require('./auth-middleware')

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.add({username: req.body.username, password: hash})
    res.status(201).json(newUser)

  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', checkUsernameExists, (req, res, next) => {
  const { password } = req.body
  if(bcrypt.compareSync(password, req.user.password)){
    req.session.user = req.user
    res.json({
      message: `Welcome ${req.user.username}`
    })
  }else{
    next({
      status: 401,
      message: 'Invalid credentials'
    })
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.post('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json('cannot log out')
      } else {
        res.json('logged out')
      }
    })
  } else {
    res.json("no session exists")
  }
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router