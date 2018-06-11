const express = require('express');
const router = express.Router();
const User = require('./UserModel');



router.route('/')
.get((req, res) => {
 User.find()
 .then(user => {
     res.status(201).json(user)
 })
 .catch(err => {
     res.status(500).json({error: err})
 })
})
.post((req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});
    newUser.save()
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
   })