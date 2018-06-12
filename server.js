const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
const User = require('./users/userModel')

mongoose.connect('mongodb://localhost/user')
        .then(() => {
            console.log('connected to database')
        })
        .catch(err => {
            console.log('database connection failed')
        })

server.use(express.json())

server.get('/', (req, res) => {
    res.json({api: 'running'})
})

server.post('/register', (req,res) => {
    const newUser = new User(req.body);
    if(!newUser.username || !newUser.password) {
        res.status(400).json({ error: "Please provide both username and password for the user." });
        return;
    }
    User.create(newUser)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            console.log('database connection failed')
        })
})

server.post('/login', (req,res) => {
    const { username, password} = req.body;
    User.findOne( { username })
        .then(user => {
            if(user) {
                user.isPasswordValid(password).then(isValid => {
                    if(isValid) {
                        res.send('login successful')
                    }else {
                        res.status(401).send('invalid credentials');
                    }
                })
            }else {
                res.status(401).send('invalid credentials')
            }
        })
        .catch(err => res.status(500).send(err));
})


server.listen(5000, () => {
    console.log('api running on port 5000')
})

