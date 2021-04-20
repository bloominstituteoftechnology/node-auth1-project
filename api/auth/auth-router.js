const bcrypt = require('bcryptjs')
const router = require('express').Router()

const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
} = require('./auth-middleware.js')

const { add: addUser } = require('../users/users-model.js')

router.post('/register', checkPasswordLength, checkUsernameFree, async (req, res) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 12)
  const user = await addUser({ username, password: hash })
  res.status(200).json(user)
})

router.post('/login', checkUsernameExists, (req, res, next) => {
  const { user } = req
  if(bcrypt.compareSync(req.body.password, user.password)){
    req.session.user = user
    // res.status(204)
    res.status(200).json({ message: `Welcome ${user.username}`})
  } else {
    next({ status: 401, message: 'Invalid credentials' })
  }
})

router.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.destroy(err => {
      err
        ? next({ message: err.message }) // not sure when this would ever run. unessacary?
        : res.status(200).json({ message: 'logged out' })
    }) // async
  } else {
    next({ message: 'no session', status: 200 })
  }
})

module.exports = router

// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

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
