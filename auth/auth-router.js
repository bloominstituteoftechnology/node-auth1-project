const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
  let user = req.body;

  //hash the password using bcryptjs
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;

  Users.add(user)
    .then(saved => {
      req.session.username = saved.username;
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
      console.log(error);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        //check that the password is valid
        req.session.username = user.username;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: "error logging out" });
      } else {
        res.status(200).json({ message: "you are logged out" });
      }
    });
  } else {
    res.status(200).json({ message: "you are not logged in" });
  }
});

module.exports = router;
