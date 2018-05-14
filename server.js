const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n connected to mongo \n');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();
server.use(express.json());

server.use(
    session({
        secret: '$2b$11$sEJoB2SkT/cpEXxFwM.kKS0PAenuO',
        resave: false,
        saveUninitialized: false
    })
)

server.post('/api/register', (req, res) => {
    const user = new User(req.body);
    user
        .save()
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('/api/login', (req, res, next) => {
    const { username, password} = req.body;
    User.findOne({username})
    .then((test) => {
        if (test) test.validation(password)
        .then((valid) => {
           if (valid) {
               req.session.name = username;
               res.status(200).json({message: "Logged In"});
           }
       }) 
    })
       .catch(err => {
        res.status(500).json({message: 'You Shall Not Pass!'});
        });
});

const verificationCheck = function (req, res, next) {
    const username = req.session.name;
    if (username) {
        User.findOne({username})
        .then((poo) => {
            next();
        })
    } else return res.status(404).json({message: 'login darnit'});
};


server.get('/api/users', verificationCheck, (req, res) => {
User.find({})
    .then(poo => {
       
        // const doo = poo.map(poop => { return poop.username});
        // console.log(doo)
        res.status(200).json(poo);
    })
    .catch(err => {
        res.status(500).json(err);
    })
})


server.listen(5000, () => console.log('\n api running on 5k \n'));