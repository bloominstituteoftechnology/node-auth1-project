const express = require('express');
const db = require('../data/db');
<<<<<<< HEAD
const bcrypt = require('bcryptjs');
=======
>>>>>>> ca8d03ed8e21348f3a4cb3d1df97383e38ea64cb
const router = express.Router();

router.post('/', (req, res) => {
    const authentication = req.body;
    
<<<<<<< HEAD
    db('users').where({userName: authentication.userName}).first().then(user => {
        if(user && bcrypt.compareSync(authentication.userPassword, user.userPassword)) {
            return res.send(`Welcome ${user.userName}`);
        } else {
            return res.status(401).json({ error: 'Username or password is incorrect'})
        }
    }).catch(err => {
        res.status(500).json(err);
=======
    db('users').where({username: authentication.username}).first().then(user => {
        if(!user || !bcrypt.compareSync(authentication.userPassword, users.userPassword)) {
            return res.status(401).json({ error: 'Incorrect password or username'})
        }
        db('users').where({ id: ids[0]}).first().then(user => {
            res.status(201).json(user);
        })
>>>>>>> ca8d03ed8e21348f3a4cb3d1df97383e38ea64cb
    })
})

module.exports = router