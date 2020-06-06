const express = require("express");

const db = require("../data/dbConfig");

const router = express.Router();

router.get("/", (req,res) => {
    db('users')
    .then(users => {
        res.json(users);
    })
    .catch(err => {
        res.status(500).json({ message: "Failed to GET users"}, err);
    });
});

module.exports = router;

