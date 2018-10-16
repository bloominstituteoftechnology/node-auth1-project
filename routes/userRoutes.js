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
            res.status(201).json(id); // sends back new user id
        })
        .catch(err => res.status(500).send(err));
});
   
router.get("/users", (req, res) => {
    db("users")
        .select("id", "username", "password")
        .then(ids => {
            res.json({newUserId: ids});
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
    
});

module.exports = router;