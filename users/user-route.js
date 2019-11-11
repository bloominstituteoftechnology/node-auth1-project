const express = require("express");
const router = express.Router();

const db = require('./user-route-helper')
const bcrypt = require('bcryptjs')


router.post("/register", (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;

    db.add(user)
        .then(saved => {
            res.status(201).json(saved)
        })
        .catch(error => {
            res.status(500).json(error.message);
        })
})

router.post("/login", (req, res) => {
    let { username, password } = req.body;

        db.findBy({ username })
            .first()
            .then( user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    req.session.user = user.username;
                    console.log(req.session);
                    res.status(200).json({ message: `Welcome, on board ${user.username}`})
                } else {
                    res.status(401).json({ message: "Invalid Credential"})
                }
            })
            .catch(error => {
                res.status(500).json({ message: "Oops. Technical difficulties on our part " + error.message})
            })        


})

const protected = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: "Invalid credentials."})
    }
}

router.get("/users", protected, (req, res) => {
    db.retrieve()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({ message: "Oops!, Something went wrong. " + error.message})
        })
})

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.send("See you soon");
    } else {
        res.status(401).json({ message: "Not logged in"})
    }

})


module.exports = router;