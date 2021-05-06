const express = require("express")
const { add, findBy } = require("../users/users-model")
const { checkUsernameFree, checkUsernameExists, checkPasswordLength } = require("../auth/auth-middleware")
const bcrypt = require("bcryptjs")

const router = express.Router()
  
router.post("/api/auth/register"), checkUsernameFree(), checkPasswordLength(), async (req, res, next) => {
    try {
      const { username, password } = req.body
  
      const newUser = await add({
        username,
        password: await bcrypt.hash(password, 14)
      })
  
      res.status(201).json(newUser)
    } catch(err) {
        next(err)
    }
  }

router.post("/api/auth/login", checkUsernameExists(), async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await findBy({ username }).first()

    const passwordValid = await bcrypt.compare(password, user.password)

    if(!passwordValid){
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }

    req.session.user = user

    res.json({
      message: `Welcome ${user.username}`
    })
  } catch(err) {
      next(err)
  }
})

router.get("/api/auth/logout", async (req, res, next) => {
  try {
    if(!req.session || !req.session.user) {
      return res.status(200).json({
        message: "no session"
      })
    }
    req.session.destroy((err) => {
      if(err) {
        next(err)
      } else {
          res.status(200).json({
            message: "logged out"
          })
      }
    })
  } catch(err) {
      next(err)
  }
})
 
module.exports = router