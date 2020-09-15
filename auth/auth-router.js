const express = require("express"); 
const bcrypt = require("bcryptjs");
const db = require("../users/usersModel"); 

const router = express.Router(); 

//* 🎆 POST and register a new user 🎆 *// 
//TODO 🧵 bcryptjs needs to be installed as a dependency to hash the user's password! // 
router.post("/register", (req, res) => {
    const { username, password } = req.body; 
    const rounds = process.env.BCRYPT_ROUNDS || 4;
    db.add({ username, password: bcrypt.hashSync(password, rounds) })
        .then(user => {
            res.status(201).json({ message: `Welcome ${username}!` }); 
        })
        .catch(error => {
            res.status(500).json(error); 
        });
});

//* 🎆 POST and login an existing user 🎆 *// 
//TODO 🧠 sanity checked - a cookie is returned and can be seen via Insomnia //
router.post("/login", (req, res) => {
    const { username, password } = req.body; 
    db.findBy(username)
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user; 
                res.status(200).json({ message: `Welcome to back ${username}!` })
            } else {
                res.status(401).json({ message: "Credentials unauthorized" }); 
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to login user" }); 
        }); 
}); 

//* router export *// 
module.exports = router; 