const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const Users = require('./users-model.js')
const restricted = require('../restricted-middleware');



//Registers user and hashes password


router.post('/register', (req, res) => {
    let { username, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
    //console.log(req.body)

    Users.add({username, password: hash})
        .then(newUser => {
            console.log(newUser)
            res.status(201).json(newUser)
        })
        .catch(error => {
            res.status(500).json(error)
        });
});


router.post('/login', (req, res) => {
    let { username, password } = req.body;
    
    Users.findBy ({ username })
        .first()
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                res.status(200).json({ message: `${user.username}, you may enter.` });
            } else {
                res.status(401).json({ message: 'You shall not pass.'});
            }
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.get('/users', restricted,  (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.send(err);
        });
});


module.exports = router;