const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../data/config");

const router = express.Router();

router.post("/api/register", async (req, res) => {
  try {
    const credentials = req.body;

    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    const id = await db("users").insert(credentials);
    res.status(201).json(await db("users").where({ id }).first());
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await db("users").where({ username }).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      // we will return 401 if the password or username are invalid
      // we don't want to let attackers know when they have a good username
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "yo you messed up" });
  }
});

router.get("/api/users", async (req, res) => {
  try {
    const users = await db("users");
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
