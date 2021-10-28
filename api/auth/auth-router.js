// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const router = express.Router()
const User = require('../users/users-model')
const bcrypt = require('bcryptjs')
const mw = require('./auth-middleware')
const {restart} = require('nodemon')

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
router.post('/register', mw.checkPasswordLength, mw.checkUsernameFree, mw.checkUsernameExists, async (req, res) => {
  try{
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.add({username: req.body.username, password: hash})
    res.status(201).json(newUser)
  }catch(err){
    res.status(500).json(`Server error: ${err.message}`)
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
router.post('/login', mw.checkPasswordLength, mw.checkUsernameExists, (req, res) => {
  try{
    const verified = bcrypt.compareSync(req.body.password, req.userData.username)
    if(verified){
      req.session.user = req.userData
      req.json(`Welcome back: ${req.userData.username}`)
    }else{
      res.status(401).json('Incorrect username or password')
    }
  }catch(err){
    res.status(500).json(`Server error: ${err.message}`)
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
router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy(err => {
      if(err){
        res.json(`Can't logout: ${err.message}`)
      }else{
        res.json(`Logged out successfully`)
      }
    })
  }else{
    res.json('Session doesnt exist')
  }
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router