const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const Users = require('./users-model');
const protected = require('./users-middleware/protected');
const restricted = require('./users-middleware/restricted');

const router = express.Router();

router.use(helmet());
router.use(express.json());

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    if (user) {
        Users.add(user)
            .then(newUser => res.status(201).json(newUser))
            .catch(err => res.status(500).json(err))
    } else {
        res.status(400).json({ message: 'Please provide a valid username and password' })
    }
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    console.log('session from users-router ', req.session);

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    req.session.username = user.username;
                    res.status(200).json({ message: `Welcome ${user.username}` })
                } else {
                    res.status(401).json({ message: 'Invalid credentials' })
                }
            })
            .catch(err => res.status(500).json(err))
    } else res.status(400).json({ message: 'Please provide valid credentials '})
})

router.get('/', restricted, (req, res) => {
    console.log('Username from users-router ', req.session.username)
    Users.find()
        .then(users => res.json(users))
        .catch(err => res.send(err))
})

router.get('/protected', protected, (req, res) => {
    Users.protectedPage()
    .then(secret => res.json('You accessed the secret page'))
    .catch(err => res.status(500).json({ message: 'You are not allowed in here' }))
})

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.status(200).json({ message: 'Successfully logged out' })
    } else {
        res.status(200).json({ message: 'You are already logged out' })
    }
})

module.exports = router;