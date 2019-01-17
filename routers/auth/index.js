const express = require("express");
const bcrypt = require("bcryptjs");
const Auth = require("../../data/helpers/auth");
const Users = require("../../data/helpers/users");
const router = express.Router();

router.post("/register", (req, res) => {
  const { newUser } = req.body;
  // check if newUser is in the req.body
  if (newUser.username.length && newUser.password.length) {
    const username = newUser.username.toLowerCase();
    // check if username exists already in the DB
    Auth.checkForUniqueUser(username)
      .then(result => {
        // check if a username is returned
        if (result.length) {
          res.status(401).json({
            error: "This username is already in use, Please try again."
          });
        } else {
          // setup salt rounds for hash
          const salt = bcrypt.genSaltSync(14);
          // replace password with new hash
          newUser.password = bcrypt.hashSync(newUser.password, salt);
          // finally register user in our DB
          Auth.registerUser(newUser)
            .then(result => {
              const id = result[0];
              // ONLY if typeof id is a number can we attempt to get user from db
              if (typeof id === "number") {
                Auth.getUser(id)
                  .then(user => {
                    res.status(201).json({ user });
                  })
                  .catch(err => {
                    res.status(500).json({ error: "Couldn't fetch newUser" });
                  });
              } else {
                res.status(500).json({
                  error: "Please check your inputs and try to register again."
                });
              }
            })
            .catch(err => {
              res.status(500).json({ error: "user is not registered" });
            });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "Please try again" });
      });
  } else {
    res.status(401).json({
      error: "Please enter the correctly formatted information to create a user"
    });
  }
});

router.post("/login", (req, res) => {
  const { clientUser } = req.body;
  // check if username and password are present in clientUser
  if (clientUser.username.length && clientUser.password.length) {
    Auth.loginUser(clientUser.username)
      .then(result => {
        const dbPass = result.password;
        const clientPass = clientUser.password;
        // check if passwords match
        if (bcrypt.compareSync(clientPass, dbPass)) {
          res.json({ message: "Authentication Passed!" });
        } else {
          res.status(401).json({
            error: "Check the username/password combination and try again"
          });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "Check your login credentials" });
      });
  } else {
    res.status(401).json({ error: "Please enter a username and password" });
  }
});

router.get("/users", (req, res) => {
  Users.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
