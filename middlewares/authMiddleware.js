const express = require("express");
const Login = require("../login/loginModel");
const bcrypt = require("bcryptjs");

function restricted(req, res, next) {
  // get username and password from the headers
  const { username, password } = req.headers;

  if (username && password) {
    Login.findUser(username)
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          // res.status(200).json({ message: `Welcome ${user.usesrname}`});
          next();
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch(err => {
        res.status(500).json({ message: "Problems validating user" });
      });
  } else {
    res.status(400).json({ message: "No credentials provided." });
  }
}

module.exports = restricted;
