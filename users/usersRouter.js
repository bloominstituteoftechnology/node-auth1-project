const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../data/db");

router.post("/login", (req, res)=>{
    if(!req.body || !req.body.email || !req.body.password) {
        return res.status(401).json({message: "email and password are required"});
    }
    const {email, password} = req.body;
    db("users").where({email: email}).first().then(user=>{
        if(!user) return res.status(401).json({message: "Incorrect username or password"});
        if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({message: "Incorrect username or password"});
        res.status(200).json(user);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({message: "A server error occurred"});
    })
});

module.exports = router;