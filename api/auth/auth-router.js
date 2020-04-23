const router = require("express").Router();
const bcrypt = require("bcryptjs");

const UserTbl = require("../../dbModels/users-model.js");

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  UserTbl.addUser(user)
    .then((newUser) => {
      res.status(201).json(newUser);
    })
    .catch((err) => {
      res.status(500).json({ message: "exception", error: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("user", username);

  UserTbl.findBy({ username })
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user.username;
        res.status(200).json({ message: `Welcome ${user.username}` });
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "exception", error: err });
    });
});

router.get("/logout", (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.send("not able to logout");
      } else {
        res.send("you have successfully logged out");
      }
    });
  } else {
    res.send("you are not logged in");
  }
});
module.exports = router;
