const router = require('express').Router();

const User = require('../../data/user/userModel.js');

router.route('/')
    .post((req, res) => {
        const { username, password } = req.body;
        User.findOne({ username })
            .then(user => {
                if (user) {
                    user.validatePassword(password)
                        .then(match => {
                            if (match) {
                                req.session.username = user.username;
                                req.session.userid = user._id;
                                res.json({ message: `Logged In` })
                            } else {
                            res.status(401).json(`Invalid Credentials`);
                            }
                        })
                        .catch(err => res.status(500).json({ error: `Error processing request.`}));
                } else {
                res.status(401).json(`Invalid Credentials`);
                }
            })
            .catch(err => res.status(500).json({ error: `Error processing request.`}));
    })

module.exports = router;