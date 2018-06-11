const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

Router.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  User.create({username, password})
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

Router.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  User.findOne({username})
    .then(user => {
      if(user) {
        user.compareHash(password, user.password, function(err, isMatch) {
          if(err) {
            return res.json(err);
          }
          if(!isMatch) {
            return res.json({msg: "Incorrect info"})
          }
          res.json({user, msg: "Success login"});
        })
      }    
    })
})

Router.get("/api/users", (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

module.exports = Router;