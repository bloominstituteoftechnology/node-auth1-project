const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../data/db");

router.post("/register", (req, res)=>{
    if(!req.body || !req.body.email || !req.body.first_name || !req.body.last_name || !req.body.password){
        return res.status(400).json({message: "All fields are required"})
    }
    const {email, first_name, last_name} = req.body;
    const password = bcrypt.hashSync(req.body.password, 14);
    db("users").insert({email, first_name, last_name, password}).then(numCreated=>{
        res.status(201).json({email, first_name, last_name});
    }).catch(err=>{
        res.status(500).json({message: "A server error occurred"});
    })
});

router.post("/login", (req, res)=>{
    if(!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({message: "email and password are required"});
    }
    const {email, password} = req.body;
    db("users").where({email: email}).first().then(user=>{
        if(!user) return res.status(401).json({message: "You shall not pass!"});
        if(!bcrypt.compareSync(password, user.password)) return res.status(401).json({message: "You shall not pass!"});
        res.status(200).json({message: "Logged in"});
    }).catch(err=>{
        console.log(err);
        res.status(500).json({message: "A server error occurred"});
    })
});

module.exports = router;