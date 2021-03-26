// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require('express')
const bcrypt = require('bcryptjs') // used for hashing passwords
const router = express.Router()
const Users = require('../users/users-model') // model function for users
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware')

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
      const { username, password } = req.body;
      const hash = await bcrypt.hashSync(password, 10);
      const userToRegister = { username, password: hash };
      const newUser = await Users.add(userToRegister);
      res.status(201).json(newUser);
    } catch(err) {
      next(err) }
  });

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

  router.post('/login',checkUsernameExists, (req, res, next)=> {
    const { username, password } = req.body;
    Users.findBy({username})
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password,user.password)) {
          req.session.user = user
          res.status(200).json({message: `Welcome ${req.session.user.username}!`})
        } else {
          res.status(401).json({message: "Invalid credentials"})
        }
      })
      .catch(next)
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

  router.get('/logout', (req,res,next)=>{
    if (req.session && req.session.user) {
      req.session.destroy(err => {
        if (err) {
          res.json('error trying to logout')
        } else {
          res.status(200).json({message: "logged out"})
        }
      })
    } else {
      res.status(200).json({message: "no session"})
    }
  })

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;