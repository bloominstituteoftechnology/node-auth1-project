const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../users/user-modal');
const router = express.Router();

const checkPayload = (req, res, next) => {
    const body = req.body;
    if (!body.username || !body.password) {
        res.status(401).json('UserName and Password are required')
    } else {
        next()
    }
}

const checkUniqueUsername = async (req, res, next) => {
    const { username } = req.body;

    try {
        const rows = await User.findBy({ username: username })
        if (!rows.length) {
            next()
        } else {
            res.status(401).json('username taken')
        }
    } catch (e) {
        res.status(500).json( e.message )
    }
};

const checkUserExists = async (req, res, next) => {
    const { username } = req.body;

    try {
        const rows = await User.findBy({ username: username })
        if (rows.length) {
            req.userData = rows[0]
            next()
        } else {
            res.status(401).json('User not found.')
        }
    } catch (e) {
        res.status(500).json( e.message )
    }
};

router.post('/register', checkPayload, checkUniqueUsername, async (req, res) => {
    const { username, password } = req.body;
    console.log('registering')

    try {
        const hash = bcrypt.hashSync(password, 12)
        const newUser = await User.add({ username: username, password: hash })
        res.status(201).json(newUser)
    } catch (e) {
        res.status(500).json(e.message)
    }
});

router.post('/login', checkPayload, checkUserExists, (req, res) => {
    
    console.log('logging in')

    try {
        const verifies = bcrypt.compareSync(req.body.password, req.userData.password)
        if (verifies) {
        req.session.user = req.userData
        res.json(`Welcome ${req.userData.username}`)
    } else {
        res.status(401).json('Bad credentials')
    }
    } catch (e) {
        res.status(500). json('Server not responding.')
    }  
});


module.exports = router;