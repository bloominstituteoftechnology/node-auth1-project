const express = require("express");
const db = require("../data/dbConfig.js");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;
    await db("users").insert(credentials);
    res.status(201).json(credentials);
  } catch (error) {
    res.status(500).json({ message: "User could not be registered." });
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
