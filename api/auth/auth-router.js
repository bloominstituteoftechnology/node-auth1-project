const express = require("express");
const router = express.Router();
const User = require("../users/users-model.js");
const bcrypt = require("bcryptjs")
const {checkPayload, checkUsernameFree, checkUsernameExists, checkPasswordLength} = require("./auth-middleware.js")


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

router.post("/login", checkPayload, checkUsernameExists, (req, res) => {
  try {
    const verifiedUser = bcrypt.compareSync(req.body.username, req.userData.password)
    if (verifiedUser) {
      res.json(`Welcome ${req.body.username}!`)
    } else {
      res.status(401).json("Invalid credentials")
    }
  }
  catch(e) {
    res.status(500).json({message: e.message})
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