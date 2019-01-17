const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const dbLogin = require('../data/userModel');

router.post('/register', (req, res) => {
    //hash password
    //insert user with hashed password
    //password must be at least 12 characters long

    const user = req.body;
    if(user.Password.length > 12){
        user.Password = bcrypt.hashSync(user.Password, 10)
        if(user.Username){
            dbLogin.add(user)
            .then(response => {
                console.log(response);
                res.status(201).json({ message: "Account created successfully!" })
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to add new account" })
            })
        } else{
            res.status(400).json({ message: "New accounts require a Username" })
        }
        
    } else {
        res.status(400).json({ message: "Password must be at least 12 characters long"})
    }
})

.post('/login', (req, res) => {
    //post request to cross check username and then hashed passwords
})

.get('/users', (req, res) => {
    //return all users if logged in properly
    //else 'You shall not pass!'
    
    dbLogin.fetch()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "Unable to fetch users" })
        })
})

module.exports = router;