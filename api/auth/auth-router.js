const express = require("express")
const router = express.Router()
const User = require('../users/users-model.js')
const bcrypt = require("bcryptjs")
const { restart } = require("nodemon")
const mw = require('./auth-middleware')

router.post("/register",mw.checkPasswordLength,mw.checkUsernameFree, mw.checkUsernameExists, async (req,res)=>{
  try{
      const hash = bcrypt.hashSync(req.body.password,10)
      const newUser = await User.add({username:req.body.username, password:hash})
      res.status(201).json(newUser)
  }catch(e){
      res.status(500).json(`Server error: ${e.message}`)
  }
})

router.post("/login",mw.checkPasswordLength, mw.checkUsernameExists,(req,res)=>{
  try{
      const verified = bcrypt.compareSync(req.body.password,req.userData.password)
      if(verified){
          req.session.user = req.userData
          res.json(`Welcome back ${req.userData.username}`)
      }else{
          res.status(401).json("Incorrect username or password")
      }
  }catch(e){
      res.status(500).json(`Server error: ${e.message}`)
  }
})

router.get("/logout",(req,res)=>{
  if(req.session){
      req.session.destroy(err=>{
          if(err){
              res.json(`Can't log out:${err.message}`)            
          }else{
              res.json("you were logged out")
          }
      })
  }else{
      res.json("Session wasn't set")
  }
})

module.exports = router