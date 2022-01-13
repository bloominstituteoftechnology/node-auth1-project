// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware')
const express = require("express")
const router = express.Router()
const Users = require("../users/users-model.js")
const bcrypt = require("bcryptjs")

router.post('/register',checkUsernameFree, checkPasswordLength, (req, res) => {
  const hash = bcrypt.hashSync(req.body.password,10);
  Users.add({username:req.body.username, password:hash})
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json(`Server error: ${err}`)
    })
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

router.post('/login', checkUsernameExists, (req,res) => {
  const user = req.body;
  try{
    const verified = bcrypt.compareSync(user.password, req.userData.password)
    if(verified){
      req.session.user = req.userData;
      res.json(`Welcome ${req.userData.username}`)
    }else{
      res.status(401).json({message: 'Invalid credentials'})
    }
  }
  catch(e){
    res.status(500).json(`Server error: ${e}`)
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

router.get('/logout', (req,res) => {
  if(req.session){
    req.session.destroy(err => {
      if(err) {
        res.json("can't log out")
      }else{
        res.json("logged out")
      }
    })
  }else{
    res.json("No session exists")
  }
})

module.exports = router
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
