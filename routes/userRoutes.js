const express = require("express");
const router = express.Router();
const db = require("../db/dbConfig");
const bcrypt = require("bcryptjs");

//MIDDLEWARE, should put this in own folder
function protected(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ message: "denied" });
  }
};

//CREATE A USERNAME/PASSWORD HERE AND GET PW HASHED
router.post("/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json(id);
    })
    .catch(err => res.status(500).send(err));
});

//DISPLAY ALL THE USERS SO FAR
router.get("/", (req, res) => {
  db("users")
    .select("id", "username", "password")
    .then(ids => {
      res.json(ids);
    })
    .catch(err => res.status(500).send(err));
});

//LOG IN TO THE SESSION HERE
router.post("/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        req.session.username = user.username;
        res.status(200).send(`Welcome ${req.session.username}`);
      } else {
        res.status(401).json({ message: "Wrong creds" });
      }
    })
    .catch(err => res.status(500).send(err));
});

//LOGOUT OF THE SESSION HERE
server.get('/api/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('logout error');
      } else {
        res.send('bye!');
      }
    });
  }
});

module.exports = router;
