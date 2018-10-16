const express = require("express");
const router = express.Router();
const db = require("../db/dbConfig");
const bcrypt = require("bcryptjs");



router.post("/register", (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 12); // generate a hash, call to bcrypt, pass the credentials, amount of times to hash
    creds.password = hash; //overrides, password = hash
    
    db("users")
        .insert(creds) //pass credentials within users table
        .then(ids => {
            const id = ids[0]; //array grab the first id
            req.session.username = user.username;
            res.status(201).json(id); // sends back new user id
        })
        .catch(err => res.status(500).send(err));
});



router.post("/login", (req, res) => {
    const creds = req.body; 
    db("users")
        .where({ username: creds.username }) 
        .first() 
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) { //compare to user password
                req.session.username = user.username;
                res.status(200).send("Welcome");
            } else {
                res.status(401).json({ message: "Truly unfortunate, access has not been granted!" });
            }
        })
        .catch(err => {
            res.status(500).json({ err });
        });
});

router.get("/users", protected, (req, res) => {
    if (req.session && req.session.username) {
    db("users")
        .select("id", "username", "password")
        .then(ids => {
            res.json({newUserId: ids});
        })
        .catch(err => res.status(500).send(err));
    }else {
        res.status(401).send('Not Authorized.');
      }
    
  });
function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: "denied" });
    }
  };


router.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('logout error');
        } else {
          res.send('Farewell good friend!');
        }
      });
    }
});

module.exports = router;