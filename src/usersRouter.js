const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
let User = require("./user.js");

router.route("/").get((req, res) => res.status(200).json({ hello: "hello" }));

router.route("/").post(async function(req, res, next) {
  try {
    let user = new User({
      username: req.body.username,
      passwordHash: req.body.passwordHash
    });
    await user.save(function(err, post) {
      if (err) {
        return next(err);
      }
      res.status(201).json(user);
    })
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;
