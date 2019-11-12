const bcrypt = require('bcryptjs');

const router = require('express').Router();

const Users = require('../users/users-model');

router.post('/register', (req, res) => {
    let userInformation = req.body;

    bcrypt.hash(userInformation.password, 12, (err, hashedpassword) => {
        userInformation.password = hashedpassword;

        Users.add(userInformation)
            .then(saved => {
                res.status(201).json(saved);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    UsersfindBy({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        })
        .catch(error => {
            console.log('login error', error);
            res.status(500).json(error)
        });
});

module.exports = router;