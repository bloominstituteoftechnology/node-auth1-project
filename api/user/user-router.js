const router = require("express").Router();
const Users = require("./user-model");
const db = require("../../database/dbConfig");
const bcrypt = require("bcryptjs");
const protected = require("../../auth/protected-middleware");

router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ mess: `welcome ${user.username}` });
      } else {
        res.status(401).json({ mess: " invalid creds" });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get("/users", protected, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});
module.exports = router;
