const express = require("express");
const Router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/UserModel");

const protected = (req, res, next) => {
  if(req.session && req.session.username){
    next();
  } else {
    res.status(401).json({message: "Who are you again"});
  }
} 

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
            return res.status(401).json({message:" Wrong password or username"});
          }
          if(!isMatch) {
            return res.json({msg: "Incorrect info"})
          }
          req.session.username = user.username;
          res.json({user, msg: `Success login ${req.session.username}`});
        })
      } else {
        res.status(401).json({msg: "Wrong password or username"});
      }    
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

Router.get("/api/users", protected, (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      res.status(500).json(err);
    })
})

Router.get("/api/logout", (req, res) => {
  if(req.session) {
    req.session.destroy(err => {
      if(err) {
        res.json({msg: "error logging out"})
      } else {
        res.json({msg: "Good bye"});
      }
    })
  }
})
module.exports = Router;