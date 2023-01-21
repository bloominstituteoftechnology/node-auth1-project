const express = require('express')
const Users = require('../users/users-model')
const bcrypt = require('bcryptjs')
const { checkUsernameFree, checkPasswordLength, checkUsernameExists } = require('./auth-middleware')
const router = express.Router()
// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!



router.post('/register', checkUsernameFree, checkPasswordLength, async (req, res, next) => {
  const { username, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 12)
    const credentials = {
      username: username,
      password: hashedPassword
    }
    const result = await Users.add(credentials)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }


})
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

router.post('/login', checkUsernameExists, async (req, res, next) => {
  try {
    const { password } = await Users.findBy(req.body.username)
    const validPassword = await bcrypt.compare(req.body.password, password)
    if (validPassword) {
      req.session.user = req.body.username
      res.status(200).json({ message: `Welcome ${req.body.username}!` })
    } else {
      next({ status: 401, message: "Invalid credentials" })
    }
  } catch (err) {
    next({ message: 'Login error, please try again' })
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

router.get('/logout', (req, res, next) => {
  try {
    if (req.session.user) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out')
        } else {
          res.status(200).json({ message: 'logged out' })
        }
      })
    } else {
      res.status(200).json({ message: 'no session' })
    }
  } catch (err) {
    next(err)
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


// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router