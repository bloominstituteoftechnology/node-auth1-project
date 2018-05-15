const routes = require('express').Router();
const User = require('../models/User');

routes.post('/register', (req, res) => {
    const { username, password } = req.body;
    const newUser = { username, password };
    const user = new User(newUser);
    user.save().then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

routes.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
        if(user) {
            user.authenticate(password)
            .then(isValid => {
                if(isValid) {
                    req.session.userId = user._id;
                    req.session.name = user.username;
                    res.status(200).json({ response: 'Successfully logged in.'})
                } else {
                    res.status(401).json({ message: 'You shall not pass!' })
                }
            })
            .catch(err => {
                res.status(500).json(err);
            })
        }
    })
    .catch(err => {
        res.status(500).json(err);
    })
})

routes.get('/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(function(err){
            if(err) {
                res.status(500).json({ message: 'could not log you out!'})
            } else {
                res.status(200).json({ message: 'Logged out successfully! '})
            }
        })
    }
})

routes.get('/restricted/name', (req, res) => {
    res.send({ greeting: `welcome back ${req.session.name}`})
})

module.exports = routes;