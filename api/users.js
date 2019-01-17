const express = require('express'),
    router = express.Router(),
    db = require('../data/helpers/userModel.js'),
    bcrypt = require('bcrypt');

router
    .post('/register', async function (req, res) {
        const { user_name, email, password, name } = req.body;
        const saltRounds = 10;

        if (!user_name || !email || !password || !name) return res.status(400).json({ errorMessage: "Missing information" });

        req.body.password = await bcrypt.hash(password, saltRounds).then(hash => hash);

        db.insert(req.body).then(users => res.status(201).json(users)).catch(err => res.status(500).json({
            error: "There was an error while saving the user to the database",
            info: { err }
        }));
    })

    .post('/login', function (req, res) {
        db.login(req.body.user_name)
            .then(user => {
                if (!user) {
                    return res.status(403).json({ error: "User not found" });
                }

                return bcrypt.compare(req.body.password, user.password).then(eq => {
                    if (eq) {
                        res.json({ success: true, user: user });
                    } else {
                        throw 'Passwords do not match'
                    }
                });

            })
            .catch(err => res.status(500).json({ error: "There was an issue logging in.", info: err }));
    })

    .get('/', function (req, res) {
        db.get().then(user => {
            if (!user) return res.status(404).json({ message: "That user does not exist" });

            res.json(user);

        }).catch(err => res.status(500).json({ error: "There was an issue fetching the user.", info: err }));
    })

    .get('/:id', function (req, res) {
        db.get(req.params.id).then(user => {
            if (!user) return res.status(404).json({ message: "That user does not exist" });

            res.json(user);

        }).catch(err => res.status(500).json({ error: "There was an issue fetching the user." }));
    });

module.exports = router;