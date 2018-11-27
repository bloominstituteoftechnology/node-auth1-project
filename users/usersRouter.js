const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../data/dbConfig.js');
const protected = require('../middleware/protected');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: 'Alive on post 3300'})
})

router.get('/api/users', protected, (req, res) => {
    db('users')
    .select('id', 'username', 'password') // added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
})


router.post('/api/register', (req, res) => {
    const creds = req.body;

    const hash = bcrypt.hashSync(creds.password, 14);
    creds.password = hash;

    db('users').insert(creds)
        .then(ids => {
            res.status(201).json(ids)
        })
        .catch(err => console.log(err));
})

router.post('/api/login', (req, res) => {
    const creds = req.body;

    db('users').where({username: creds.username}).first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                req.session.userId = user.id;
                res.status(201).json({message: 'logged in'})
                return
            }
            res.status(401).json({mesasge: 'error logging in'})
        })
        .catch(err => console.log(err));
});

module.exports = router;