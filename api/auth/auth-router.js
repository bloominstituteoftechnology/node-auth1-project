const express = require("express");
const router = express.Router();
const User = require("../users/users-model.js");
const bcrypt = require("bcryptjs")
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require("./auth-middleware.js")


router.post("/register", checkUsernameFree, checkPasswordLength, async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = await User.add({username: req.body.username, password: hash})
    res.status(201).json(newUser)
  }
  catch(e) {
    res.status(500).json({message: e.message})
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