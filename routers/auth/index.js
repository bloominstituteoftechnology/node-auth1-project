const express = require("express");
const bcrypt = require("bcryptjs");
const DB = require("../../data/helpers/auth");
const router = express.Router();

router.post("/login", (req, res) => {});

router.post("/register", (req, res) => {
  const { newUser } = req.body;
  // check if newUser is in the req.body
  if (newUser.username.length && newUser.password.length) {
    const username = newUser.username.toLowerCase();
    // check if username exists already in the DB
    DB.checkForUniqueUser(username)
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
          DB.registerUser(newUser)
            .then(result => {
              const id = result[0];
              // ONLY if typeof id is a number can we attempt to get user from db
              if (typeof id === "number") {
                DB.getUser(id)
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

module.exports = router;
