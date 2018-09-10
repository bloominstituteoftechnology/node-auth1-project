"use strict";
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");
// GET/users NEEDS TO BE FINISHED TOMORROW(2-day project) AFTER LEARNING COOKIES
// get start
router.get("/users", (req, res, next) => {
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

// post start
// register stores the username and pass in the db
router.post("/register", (req, res, next) => {
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
router.post("/login", (req, res, next) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).send("working");
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      err.code = 500;
      next(err);
    });
});

module.exports = router;
