// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

const express = require('express');
const User = require('../users/users-model');
const middleware = require('./auth-middleware');
const bcrypt = require('bcryptjs');
const router = express.Router();

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

router.post('/register', middleware.checkUsernameFree, middleware.checkPasswordLength, async (req, res, next) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.add({username: req.body.username, password: hash})
    res.status(201).json(newUser)

  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
})

router.post('/login', middleware.checkUsernameExists, (req, res, next) => {
  try {
    const verified = bcrypt.compareSync(req.body.password, req.userData.password) // comparing hashed passwords -- use data is from the middleware
    if (verified) {
      req.session.user = req.userData
      res.status(200).json({message: `Welcome ${user.username}`});
    } else {
      res.status(401).json('invalid credentials')
    }
  } catch(err) {
    res.status(500).json(`Server error: ${err}`)
  }
})

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

modules.exports = router