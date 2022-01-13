// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

//start with the router

const router = require('express').Router()
const bycrypt = require('bcryptjs')
const User = require('../users/users-model')

const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
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

router.post('/register', checkUsernameFree, checkPasswordLength, (req, res, next) => {
  //res.json('register')
  const { username, password } = req.body
  const hash = bycrypt.hashSync(password, 10) // this is 2^10 rounds of hashing

  User.add({ username, password: hash })
    .then(saved => {
      res.status(201).json(saved)
    })
    .catch(error => {
      next(error)
    })
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
    //res.json('login')
    const { username, password } = req.body
    if (bycrypt.compareSync(password, req.user.password) ) {
      //make it so that the user is logged in
      req.session.user = req.user
      res.status(200).json({ message: `Welcome ${username}!` })
    } else {
      next({ status: 401, message: "Invalid credentials" })
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

  router.get('/logout', (req, res, next) => {
    //res.json('logout')
    if (req.session.user) {
    req.session.destroy(err=>{
      if(err){
        next(err)
      } else {
        res.status(200).json({ message: "logged out" })
      }
    })
    } else {
      res.status(200).json({ message: "no session" })
    }
  })

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router;
 