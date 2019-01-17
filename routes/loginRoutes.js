const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const dbLogin = require('../data/userModel');

router.post('/register', (req, res) => {
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
    const loginUser = req.body;
    if(loginUser.Username && loginUser.Password){
        dbLogin.login(loginUser.Username)
            .then(response => {
                if(response.length && bcrypt.compareSync(loginUser.Password, response[0].Password)){
                    res.json({ message: "Login successful!" })
                } else {
                    res.status(404).json({ message: "Invalid username or password" })
                }
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to login" })
            })
    } else {
        res.status(400).json({ message: "Please login with username and password" })
    }
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