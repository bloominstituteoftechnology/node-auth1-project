"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");
const middlewareFunctions = require("../middleware/middlewareFunctions.js");

// gets users if logged in
router.get("/users", middlewareFunctions.protected, (req, res, next) => {
  db("users")
    .select("id", "username", "password")
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      err.code = 500;
      next(err);
    });
});

// register stores the username and pass in the db
router.post("/register", middlewareFunctions.reqBodyCheck, (req, res, next) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;
  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => {
      err.code = 500;
      next(err);
    });
});

// login checks to make sure the correct pass has been applied
router.post("/login", middlewareFunctions.reqBodyCheck, (req, res, next) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Hello, ${req.session.username}`);
      } else {
        try {
          throw new Error();
        } catch (err) {
          err.code = 401;
          next(err);
        }
      }
    })
    .catch(err => {
      err.code = 500;
      next(err);
    });
});

// logout to delete session storage
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("error logging out");
      } else {
        res.send("Successfully logged out.");
      }
    });
  }
});

module.exports = router;
