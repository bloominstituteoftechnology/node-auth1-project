const express = require("express");
const Router = express.Router();
const User = require("../models/UserModel");

Router.post("/api/register", (req, res) => {

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