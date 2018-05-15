const express = require('express');

const User = require('../users/User');

const router = express.Router();
router
    .get('/', (req, res) => {
        console.log('Inside of restricted, this is the session:', req.session);
        res.send(req.session)
    })
    .get('/something', (req, res) => {
        User.find().then(user => res.send(user))
    })
    .get('/other', (req, res) => {
        res.send('This is /other')
    })
    .get('/a', (req, res) => {
        res.send('This is /a')
    })
