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