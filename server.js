const express = require('express');
const mongoose = require('mongoose');

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
function authenticate(req, res, next) {
    server.get('/api/users', (req, res) => {
        User.find().then(users => {
        let matchedUser = users.filter(user => {return user.password == req.body.password})[0]
        })
    })

    // convert req.body.password to hash
    bcrypt.hash(req.body.password, 12, (err, hash) => {
        if(err) {
            return err;
        }
        return req.body.password = hash; 
    })

    // check to see if password entered === password on file
    if (req.body.password === matchedUser.password) {
        next();
    } else {
        res.status(401).json({ message: 'You shall not pass!!!'})
    }
}r



server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
})

server.post('/api/register', (req, res) => {

    User.create(req.body).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        res.status(500).json(err)
    });
})

server.post('/api/login', authenticate, (req, res) => {
    res.json('Welcome to your user portal!')
})




server.listen(3000, () => { 
    console.log('\n*** API running on post 3k *** \n'); 
});