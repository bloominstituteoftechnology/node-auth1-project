const express = require("express");
const router = express.Router();
const db = require("../db/dbConfig");
const bcrypt = require("bcryptjs");



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
   
router.get("/users", (req, res) => {
    db("users")
        .select("id", "username")
        .then(ids => {
            res.json(ids);
        })
        .catch(err => res.status(500).send(err));
});

router.post("/login", (req, res) => {
    const creds = req.body;
    db("users")
        .where({ username: creds.username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).send("Welcome");
            } else {
                res.status(401).json({ message: "Truly unfortunate, access has not been granted!" });
            }
        })
});

module.exports = router;