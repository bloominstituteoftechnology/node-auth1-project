const express = require("express");
const db = require("../data/dbConfig.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    const newUser = await db("users").insert(credentials);
    try {
      const user = await db("users")
        .where({ id: newUser[0] })
        .first();
      req.session.username = user.username;
      return res.status(201).json(user);
    } catch (error) {
      return res
        .status(404)
        .json({ message: "User is broken.", error: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: "User could not be registered." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const credentials = req.body;
    const user = await db("users")
      .where({ username: credentials.username })
      .first();
    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      res.status(201).json({ message: `${user.username} has Logged in.` });
    } else {
      res.status(404).json({ message: "You shall not pass!" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred during login." });
  }
});

module.exports = router;
