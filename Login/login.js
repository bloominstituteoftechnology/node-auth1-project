const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/dbConfig.js");
const router = express.Router();

//========middleware==========//
function auth(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).json({ Error: "You shall not pass!!" });
  }
}
//========middleware==========//

//============GET ENDPOINT============//
router.get("/users", auth, (req, res) => {
  db("users")
    .select("id", "username")
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Could not get users" });
    });
});
//============GET ENDPOINT============//

//============GET LOGOUT============//
router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send("Error logging out");
      } else {
        res.send("Good Bye");
      }
    });
  }
});
//============GET LOGOUT============//

//============POST REGISTER ENDPOINT============//
router.post("/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 3);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(200).json(id);
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Couldn't post register" });
    });
});
//============POST REGISTER ENDPOINT============//

//============POST LOGIN ENDPOINT============//
router.post("/login", (req, res) => {
  const creds = req.body;
    console.log("REQ SESSION: " , req.session);

  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        // grab roles from user
        // req.session.roles = roles
        req.session.username = user.username;

        res
          .status(200)
          .send(`Welcome ${req.session.username} To FSW12 Lamda School`);
      } else {
        res.status(401).json({ Error: "Cannot Authorize" });
      }
    })
    .catch(err => {
      console.log("Error: ", err);
      res.status(500).json({ Error: "Login Failed" });
    });
});
//============POST LOGIN ENDPOINT============//

module.exports = router;
