const express = require('express');
const router = express.Router();
const User = require('./UserModel');
const session = require('express-session');
const bcrypt = require('bcrypt');



router.get('/api/users', (req, res) => {
 User.find()
 .then(user => {
     res.status(200).json(user)
 })
 .catch(err => {
     res.status(500).json({error: err})
 })
})

router.post('/api/register',(req, res) => {
    const { username, password } = req.body;
    const newUser = new User({username, password});
    User.create(newUser)
    .then(user => {
        res.status(201).json(user)
    })
    .catch(err => {
        res.status(500).json({error: err})
    })
   })

  
   router.post('/api/login', (req, res) => {
      const account = req.body
      User.find({ username: account.username })
        .then(response => {
          let hashPassword = response[0].password
          bcrypt.compare(account.password, hashPassword, function(err, response) {
            if (err) return res.status(500).json({ message: err })
            if (response) return res.status(200).json({ message: 'You are logged in!' })
            return res.status(401).json({ message: 'You shall not pass.' })
          })
        })
        .catch(err => res.status(500).json({ message: err }))
    });
    

   module.exports = router;