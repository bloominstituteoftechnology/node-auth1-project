const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/authdb').then(() => {
    console.log('\n*** Connected to database *** \n'); 
})
.catch(err => {
    console.log('error connecting to database', err)
});

const server = express();

server.use(express.json());

// middleware
// function authenticate(req, res, next) {
    
//     if (req.body.password === 'testpassword') {
//         next();
//     } else {
//         res.status(401).json({ message: 'You shall not pass!!!'})
//     }
// }



server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
})

// REGISTER
server.post('/api/register', (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Please provide a username and password to continue"})
        return;
    }
    User.create(req.body).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        res.status(500).json(err)
    });
})

// LOGIN
server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if(user) {
                // compare the passwords
                user.isPasswordValid(password).then(isValid => {
                    if(isValid) {
                        res.send('login successful')
                    } else {
                        res.status(401).json('invalid credentials!') // use 401 instead of 404 so not to give away that user doesnt exist
                    }
                })
            } else {
                res.status(401).json('invalid credentials!')
            }
        })
})




server.listen(3000, () => { 
    console.log('\n*** API running on post 3k *** \n'); 
});