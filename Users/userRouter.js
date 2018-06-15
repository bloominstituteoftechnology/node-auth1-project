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

        if(!username || !password) {
            res.status(401).json({error: 'Enter log-in credentials (username and password).'})
        }

        User.findOne({username})
        .then( user => {
            user.passwordChecker(password, loggedIn => {
                if(loggedIn) {
                    req.session.userLoggedIn = true;
                    res.status(200).json({msg : 'Logged in'})
                } else {
                    res.status(401).json({ msg: 'Unauthorized'})
                }
            })
        })
        .catch(err => {
            res.status(402).json({ msg: 'You shall not pass!'});
        })
    })
    .get('/users', (req, res) => {

        const { session } = req;

        User.find()
        .then(userData => {
            if(session.userLoggedIn) {
                res.status(200).json(userData)
            } else {
                res.status(401).json({ msg: 'You are not authorized to get this data.'})
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })


    module.exports = router;