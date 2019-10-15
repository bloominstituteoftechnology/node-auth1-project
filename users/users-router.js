const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const Users = require('./users-model');

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
                    res.status(200).json({ message: `Welcome ${user.username}` })
                } else {
                    res.status(401).json({ message: 'Invalid credentials' })
                }
            })
            .catch(err => res.status(500).json(err))
    } else res.status(400).json({ message: 'Please provide valid credentials '})
})

router.get('/', protected, (req, res) => {
    Users.find()
        .then(users => res.json(users))
        .catch(err => res.send(err))
})

router.get('/protected', protected, (req, res) => {
    Users.protectedPage()
    .then(secret => res.json('You accessed the secret page'))
    .catch(err => res.status(500).json({ message: 'You are not allowed in here' }))
})

function protected (req, res, next) {
    const { username, password } = req.headers;

    if (username && password) {
        Users.findBy({ username })
            .first()
            .then(user => {
                if (user && bcrypt.compareSync(password, user.password)) {
                    next();
                } else {
                    res.status(401).json({ message: 'Invalid Credentials' })
                }
            })
            .catch(err => res.status(500).json(err))
    } else {
        res.status(400).json({ message: 'Please provide valid credentials' })
    }
};

module.exports = router;