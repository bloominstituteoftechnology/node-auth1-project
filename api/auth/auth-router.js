// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router();
const bcrypt = require('bcryptjs')
const Users = require('../users/users-model');
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require('./auth-middleware');

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
  const {username, password} = req.body;
  const hash = bcrypt.hashSync(password, 8);
  Users.add({username, password: hash})
    .then(newUser => {
      res.status(200).json(newUser)
    })
    .catch(next)
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
  const {user, password} = req.body;
  if (bcrypt.compareSync(password, user.password)) {
    req.session.user = user;
    res.status(200).json({ message: `Welcome ${user.username}!`})
  } else {
    next({message: "Invalid credentials", status: 401})
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
  if (req.session.user) {
    req.session.destroy(err => {
      if (err) {
        next({message: "no session", status: 200})
      }
      else {
        res.status(200).json({message: "logged out"})
      }
    })
  } else {
    next({message: "no session", status: 200})
  }
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;