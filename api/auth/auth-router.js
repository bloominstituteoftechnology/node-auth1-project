const express = require('express');
const bcrypt = require('bcryptjs');
const User = require("../users/users-model.js");

const router = express.Router();

/// MIDDLEWARE
const checkPayload = (req, res, next) => {
    if(!req.body.username || !req.body.password ){
        res.status(401).json({ message: "Required field is missing." })
    } else {
        next();
    }
}

const checkUsernameUnique = async (req, res, next) => {
    try {
        const rows = await User.findBy({ username: req.body.username })

        if(!rows.length) {
            next();
        } else{
            res.status(400).json({ message: "Username already in use." })
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message})
    }
}

const checkUsernameExists = async (req, res, next) => {
    try {
        const rows = await User.findBy({ username: req.body.username })

        if(rows.length) {
            req.userData = rows[0]; // appending req with username & password
            next();
        } else{
            res.status(400).json({ message: "Username may not exist." })
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message})
    }
}



/// ENDPOINTS
router.post("/register", checkPayload, checkUsernameUnique, async (req,res) => {
    console.log("registering")

    try {
        const hash = bcrypt.hashSync(req.body.password, 10); // 2 ^ 10 rounds of hashing the hash.
    
        const newUser = await User.add({username: req.body.username, password: hash})
    
        res.status(201).json(newUser)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }


})

router.post("/login", checkPayload, checkUsernameExists, (req,res) => {
    console.log("logging in")
    // check req.body.password (raw password) against the hash saved inside of req.userDate
    try {
        const verified = bcrypt.compareSync(req.body.password, req.userData.password)
    
        if(verified){
            console.log("we should save a session for this user.")
        } else {
            res.status(401).json({ message: "bad credentials."})
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.post("/logout", (req,res) => {
    console.log("goodbye")
})


module.exports = router;