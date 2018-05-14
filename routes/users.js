const routes = require('express').Router();
const User = require('../models/User');

routes.get('/users', (req, res) => {
    if(req.session.userId) {
        User.find().then(users => {
            res.status(200).json(users);
        }).catch(err => {
            res.status(500).json(err);
        })
    } else {
        res.status(401).json({ message: 'You shall not pass!'})
    }
})

module.exports = routes;