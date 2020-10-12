const router = require("express").Router();
const Users = require("../users/users-model");
const bcryptjs = require("bcryptjs");

router.post("/register", (req, res) => {
  const credentials = req.body;
  console.log(credentials);
  const hash = bcryptjs.hashSync(credentials.password, 10);

  credentials.password = hash;

  Users.add(credentials)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      res.status(500).json({ Message: err.message });
    });
});

router.post("/login", (req, res) => {
  const credentials = req.body;
  Users.findBy({ username: credentials.username })
    .then((users) => {
      const user = users[0];
      req.session.username = user.username;
      if (user && bcryptjs.compareSync(credentials.password, user.password)) {
        res
          .status(200)
          .json({ Message: "Welcome", username: req.session.username });
      } else {
        res.status(400).json({ Message: "No such user" });
      }
    })
    .catch((err) => {
      res.status(500).json({ Message: err.message });
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(404).json({ Message: "Failed to logout please try again" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
