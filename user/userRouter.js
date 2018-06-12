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
      const {username, password } = req.body
      User.findOne({ username})
        .then(user => {
            if(user) {  
                user.validatePassword(password)   //helper function used-Defined in userModel.js          
                // bcrypt.compare(password, user.password) without helper function
                .then(match => {                    
                    if(match) {                   
                    res.status(201).json('success');
                    }
                    else {
                    res.status(401).json('invalid credentials');
                    }      
                })
                .catch(err => {
                    res.status(500).json('error comparing password');
                })
            }
            else {
                res.status(401).json('invalid credentials');
            }          
          })    
        .catch(err => res.status(500).json({ message: `You shall not pass! error: ${err}` }))
    });
    

   module.exports = router;