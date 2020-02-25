const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  console.log(req.body, "checking");
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      req.session.loggedIn = true;
      res.status(201).json(saved);
    })
    .catch(error => {
      console.log("errors", error);
      res.status(500).json(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  console.log(username);
  // if (username && password) {
  Users.getby({ username })
    .first()
    .then(user => {
      console.log(user, "checking");
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = user.username;
        res.status(200).json({
          message: `Welcome ${user.username}!`
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(({ name, message, stack }) => {
      res.status(500).json({ name, message, stack });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({
          you: "can check out anytime you like, but you can never leave!"
        });
      } else {
        res.status(200).json({ you: "logged out successfully" });
      }
    });
  } else {
    res.status(200).json({ bye: "felicia" });
  }
});

module.exports = router;
