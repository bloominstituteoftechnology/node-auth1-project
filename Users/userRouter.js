const router = require('express').Router();
const User = require('./userModel');

router
    .post('/register', (req, res) => {

        const user = new User(req.body);
        user.save()
            .then(savedUser => {
                res.status(201).json(savedUser);
            })
            .catch(err => {
                res.status(500).json(err);
            })
    })
    .post('/login', (req, res) => {
        const { username, password } = req.body;

        User.find({username})
        .then( user => {
            if(password === user[0].password) {

                // return a session with a cookie
                res.status(200).json(user)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(err => {
            res.status(402).json({ msg: 'You shall not pass!'});
        })
    })

    module.exports = router;