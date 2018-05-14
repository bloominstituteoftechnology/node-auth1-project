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


module.exports = routes;