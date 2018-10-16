const express = require("express");
const db = require("../data/dbConfig.js");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const restrictedRoutes = require("./restrictedRoutes");

const router = express.Router();

router.use("/restricted", restrictedRoutes);

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
      // added session username
      req.session.username = user.username;
      return res.status(200).json({ message: `${user.username} logged in.` });
    } else {
      return res
        .status(404)
        .json({ message: "You shall not pass your attempt was logged!" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred during the login." });
  }
});

router.get("/logout", restrictedRoutes, (req, res) => {
  if (req.session) {
    req.seesion.destroy(err => {
      if (err) {
        res.json({ err });
      } else {
        res.json({ message: "you are logged out" });
      }
    });
  } else {
    res.status(500).json({ message: "An error occurred during the logout" });
  }
});

router.get("/users", async (req, res) => {
  // check if user has an active session
  if (!req.session.username) {
    return res.status(400).json({ message: "You shall not pass!" });
  }
  try {
    const allUsers = await db("users");
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(500).json({ message: "Users could not be retrieved." });
  }
});

module.exports = router;
