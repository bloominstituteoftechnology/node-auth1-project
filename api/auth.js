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
                        req.session.user = user;
                        res.json({ success: true, session: req.session });
                    } else {
                        throw 'Passwords do not match';
                    }
                });

            })
            .catch(err => res.status(500).json({ error: "There was an issue logging in.", info: err }));
    })
    .get('/logout', (req, res) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    res.send('Could not log out');
                } else {
                    res.send('Thank you come again');
                }
            });
        }
    });

module.exports = router;