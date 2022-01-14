// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()
const User = require('../users/users-model.js')
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require('./auth-middleware')


router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
  const newUser = req.body

  const hash = bcrypt.hashSync(newUser.password, 12)
  
  newUser.password = hash

  User.add(newUser)
    .then(saved => {
      res.status(201).json({message: `Welcome ${saved.username}`})
    }).catch(next)
})

router.post('/login',checkUsernameExists, (req, res, next) => {
  const { username, password } = req.body
  
  User.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({message: `${username} has arrived`})
      } else {
        next(res.status(401).json({message: 'invalid credentials'}))
    }
    }).catch(next)
})

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.json({message: 'cannot log out'})
      } else {
        res.json({message: 'you have succesfully logged out'})
      }
    })
  } else {
    res.json({message: 'you are not logged in'})
  }
})

module.exports = router

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
