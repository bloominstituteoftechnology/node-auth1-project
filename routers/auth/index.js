const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const Auth = require("../../data/helpers/auth");
const Users = require("../../data/helpers/users");
const router = express.Router();

router.use(
  session({
    name: process.env.NAME || "Admin",
    secret: process.env.SECRET || "this is a secret",
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  })
);

const protected = (req, res, next) => {
  req.session && req.session.userId
    ? next()
    : res.status(400).json({ error: "Please login" });
};

router.post("/register", (req, res) => {
  const { newUser } = req.body;
  console.log("session", req.session);
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
          req.session.userId = result.id;
          res.json({ message: "Logged in", session: req.session });
        } else {
          res.status(401).json({
            error: "You shall not pass!"
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

//LOGOUT
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    err
      ? res.status(500).json({ error: "failed logout" })
      : res.json({ message: "logged out" });
  });
});

router.get("/users", protected, (req, res) => {
  Users.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
