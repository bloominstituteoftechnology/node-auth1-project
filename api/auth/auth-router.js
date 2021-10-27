// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const express = require("express");
const router = express.Router();
const User = require("../users/users-model.js");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { restricted, checkUsernameExists } = require("./auth-middleware.js");

router.post("/register", async (req, res ) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.add({ username: req.body.username, password: hash})
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json(`Server error: ${error.message}`)
  }
})

router.post("/login", checkUsernameExists,  (req, res) => {
  try {
    const verified = bcrypt.compareSync(req.body.password, req.userData.username)
    if(verified){
      req.session.user = req.userData
      req.json(`Welcome back ${req.userData.username}`)
    } else {
      res.status(401).json("Incorrect username or password")
    }
  } catch (error) {
    res.status(500).json(`Server error: ${error.message}`)
  }
})

router.get("/logout", (req, res) => {
  if(req.session){
    req.session.destroy(e => {
      if(e){
        res.json(`Can't log out: ${e.message}`)
      } else {
        res.json(`Logged out successfully.`)
      }
    })
  } else {
    res.json("Session doesn't exist")
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