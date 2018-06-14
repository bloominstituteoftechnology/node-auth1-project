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

        // findOne
        User.findOne({username})
        .then( user => {
            user.passwordChecker(password, loggedIn => {
                if(loggedIn) {
                    res.status(200).json({msg : 'Logged in'})
                } else {
                    res.status(401).json({ msg: 'Unauthorized'})
                }
            })
            // if(password === user[0].password) {
            //     // req.session.isLoggedIn = true;
            //     // return a session with a cookie
            //     res.status(200).json(user)
            // } else {
            //     res.sendStatus(401)
            // }
        })
        .catch(err => {
            res.status(402).json({ msg: 'You shall not pass!'});
        })
    })
    // server.get('/users', (req, res) => {
    //     const { session } = req;
    //     if(session.isLoggedIn) {
    //         res.status(200).json({ msg: 'You can get this data'})
    //     } else {
    //         res.status(401).json({msg: 'danger danger, cant access'})
    //     }
    // })

    module.exports = router;