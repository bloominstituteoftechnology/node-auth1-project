const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const session = require("express-session");

let User = require("./user.js");

router.route("/").post(async function(req, res, next) {
  try {
    const { username, passwordHash } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const isValid = await user.isPasswordValid(passwordHash);
      if (isValid) {
        req.session.name = user.username;
        res.status(200).json({ response: "have a cookie" });
      } else {
        res.status(401).json({ msg: "you shall not pass" });
      }
    } else {res.status(401).json({msg:"you shall not pass"})};
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
