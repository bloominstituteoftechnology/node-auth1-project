const router = require('express').Router();

const bcrypt = require('bcryptjs');
const knex = require('../database/connection.js');

const Users = require('../users/users-model.js');

router.post('/register', async (req, res) => {
    const user = req.body;

    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    try {
        const saved = await Users.add(user);
        res.status(201).json(saved);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    let { username, password } = req.body;

    try {
        const user = await Users.findBy({ username }).first();
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            res.status(200).json({ message: `Welcome ${user.username}!`, });
        } else {
            res.status(401).json({ message: 'invalid username or password' });
        }
    } catch (err) {
        res.status(500).json(error);
    }
});

router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ message: 'error logging out:', error: err });
            } else {
                res.json({ message: 'logged out'});
            }
        });
    } else {
        res.end();
    }
});

module.exports = router; 