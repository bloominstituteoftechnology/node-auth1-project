const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // validate the user credentials, check password length, make sure it's alphanumeric, etc.
    // look at https://www.npmjs.com/package/joi for validation, also look at https://www.npmjs.com/package/express-validator

    const rounds = process.env.HASH_ROUNDS || 8; // 8 is the number of rounds as 2 ^ 8
    const hash = bcrypt.hashSync(password, rounds);

    Users.add({ username, password: hash })
        .then(user => {
            res.status(201).json({ data: user });
        })
        .catch(err => res.json({ error: err.message }));
});

router.post("/login", (req, res) => {
    let { username, password } = req.body;

    Users.findBy({ username })
        .then(users => {
            const user = users[0];

            if (user && bcrypt.compareSync(password, user.password)) {
                // user exists and password is good

                req.session.loggedIn = true;

                res.status(200).json({
                    hello: user.username,
                    session: req.session,
                });
            } else {
                res.status(401).json({ error: "you shall not pass!" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(error => {
            if (error) {
                res.status(500).json({
                    error: "could not log you out, please try later",
                });
            } else {
                res.status(204).end();
            }
        });
    } else {
        res.status(200).json({ message: "already logged out" });
    }
});

module.exports = router;
