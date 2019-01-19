const usersDb = require("../data/helpers/usersDb");
const bcrypt = require("bcryptjs");
const customMw = require("../customMiddleware");

const express = require("express");
const router = express.Router();
const protect = customMw.protect;

router.post("/register", (req, res) => {
  const user = req.body;

  if (
    !user.username ||
    typeof user.username !== "string" ||
    user.username === ""
  ) {
    res
      .status(400)
      .json({ error: "username must be included and must be a string" });
  } else if (
    !user.password ||
    typeof user.password !== "string" ||
    user.password === ""
  ) {
    res
      .status(400)
      .json({ error: "password must be included and must be a string" });
  } else {
    user.password = bcrypt.hashSync(user.password, 14);
    usersDb
      .insert(user)
      .then(id => res.status(200).json(id))
      .catch(err => res.status(500).json({ message: "trouble adding user" }));
  }
});

router.post("/login", (req, res) => {
  const user = req.body;
  if (
    !user.username ||
    typeof user.username !== "string" ||
    user.username === ""
  ) {
    res
      .status(400)
      .json({ error: "username must be included and must be a string" });
  } else if (
    !user.password ||
    typeof user.password !== "string" ||
    user.password === ""
  ) {
    res
      .status(400)
      .json({ error: "password must be included and must be a string" });
  } else {
    usersDb
      .findByUsername(user.username)
      .then(users => {
        if (users[0] && bcrypt.compareSync(user.password, users[0].password)) {
          req.session.userId = users[0].id;
          res.status(200).json({session: req.session, message: "Logged In" });
        } else {
          res.status(404).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        res.status(500).json({ error: "trouble logging in" });
      });
  }
});
router.get("/users", protect, (req, res) => {
  usersDb
  .get()
  .then(users => {
    res.send(users)
  })
  .catch(err => {
    res.status(500).json({message: "You shall not pass!"})
  })
})

module.exports = router;
