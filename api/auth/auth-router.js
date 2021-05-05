const express = require("express")
const bcrypt = require("bcryptjs")
const router = express.Router()

const db = require("../users/users-model")
const mw = require("./auth-middleware")
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
router.post("/api/auth/register", mw.checkUsernameFree(), mw.checkPasswordLength(), async (req, res, next) => {
try {
  const { username, password } = req.body
  const registerUser = await db.add({
    username,
    password: await bcrypt.hash(password, 14),
  })
    if (registerUser) {
      res.status(201).json(registerUser)
  
  } else {
      res.status(401).json({message: "Unable to register user"})
  }
  } catch(err) {
    next(err)
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
router.post("/api/auth/login", mw.checkPasswordLength(), mw.checkUsernameExists(), async (req, res, next) => {
try {
  const { username, password } = req.body
  const user = await db.findBy({username}).first()
  const passwordValid = await bcrypt.compare(password, user.password)
    if (passwordValid) {
      req.session.user = user
      res.status(200).json({message: `Welcome ${user.username}`})
    
    } else {
      return res.status(401).json({message: "Invalid Credentials"})
    }

  } catch(err) {
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