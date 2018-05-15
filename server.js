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
    //Since usernames are unique i use them as an id and pass it through to findone
    User.findOne({username})
    .then((test) => {
        if (test) test.validation(password)
        //I then test whether the password passed in is in fact the origin password for that username
        .then((valid) => {
           if (valid) {
               //if that password attempt is valid and correct then i set the username as the session username and pass a message
               req.session.name = username;
               res.status(200).json({message: "Logged In"});
           }
       }) 
    })
       .catch(err => {
        res.status(500).json({message: 'You Shall Not Pass!'});
        });
});

server.use('/api/restricted/', function (req, res, next){
    //I figured out how to make this global instead of local by wrapping my previous function in server.use;
    //I use req.session.name to pass the username throughout the session 
    const username = req.session.name;
        if (username) {
            User.findOne({username})
            .then((poo) => {
                next();
            })
        } else return res.status(404).json({message: 'login darnit'});
})


server.get('/api/restricted/users', (req, res) => {
User.find({})
    .then(poo => {
        // const doo = poo.map(poop => { return {username: poop.username}}); 
        //If i just wanted the username i could take out the key value pair and return poop.username;
        // console.log(doo); 
        res.status(200).json(poo);
    })
    .catch(err => {
        res.status(500).json(err);
    })
})


server.listen(5000, () => console.log('\n api running on 5k \n'));