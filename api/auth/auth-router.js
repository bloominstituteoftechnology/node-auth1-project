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
    console.log(req.userData)
    const verifiedUser = bcrypt.compareSync(req.body.password, req.userData.password)
    if (verifiedUser) {
      req.session.user = req.userData
      res.status(200).json(`Welcome ${req.userData.username}!`)
    } else {
      res.status(401).json("Invalid credentials")
    }
  }
  catch(e) {
    res.status(500).json({message: e.message})
  }
})

router.get("/logout", (req, res) => {
  if(req.session.user) {
    req.session.destroy(e => {
      if(e) {
        res.status(400).json(`Cannot log out ${e.message}`)
      } else {
        res.status(200).json("logged out")
      }
    })
  } else {
    res.status(200).json("no session")
  }
})

module.exports = router