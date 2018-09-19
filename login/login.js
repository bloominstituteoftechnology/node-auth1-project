const express = require("express");
const knex = require("knex");
const dbConfig = require("../knexfile");
const db = knex(dbConfig.development);
const router = express.Router();
const bcrypt = require("bcryptjs");
const server = express();
// router.get


auth = (req, res, next) => {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: "go back to the shadows!" });
    }
  };
  


router.post("/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 12);
    creds.password = hash;
  
    db("users")
      .insert(creds)
      .then(ids => {
        const id = ids[0];
        res.status(201).json(id);
      })
      .catch(err => res.status(500).send(err));
  });

  router.post("/api/login", (req, res) => {
    const creds = req.body;
    db("users")
      .where({ username: creds.username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(creds.password, user.password)) {
          req.session.username = user.username;
          res.status(200).json(`Welcome ${creds.username}`);
        } else {
          res
            .status(401)
            .json({ message: "You shall not pass! Go Back to the Shadows!" });
        }
      })
      .catch(err => res.status(500).send(err));
  });


  router.get("/api/users", auth, (req, res) => {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.json({ message: "Please login to access information" }));
  });


  server.get("/", (req, res) => {
    res.send("hello world");
  });
  
  //router post
  
  server.get("/api/logout", (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send("error logging out");
        } else {
          res.send("good bye");
        }
      });
    }
  });
  
  
  
  server.get("/api/users", auth, (req, res) => {
    db("users")
      .select("id", "username", "password")
      .then(users => {
        res.json(users);
      })
      .catch(err => res.json({ message: "Please login to access information" }));
  });


  module.exports = router;