const router = require('express').Router();
const User = require('./userModel');

const isAuthorized = (req, res, next) => {
    const { session } = req;
    
    if(session.userLoggedIn) {
        return next();
    } else {
        res.status(401).json({ Error: 'Not authorized to see the data.'})
    }
}

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
    .get('/users', isAuthorized, (req, res) => {

        User.find()
        .then(userData => {
                res.status(200).json(userData)
        })
        .catch(err => {
            res.status(500).json(err);
        })
    })


    module.exports = router;