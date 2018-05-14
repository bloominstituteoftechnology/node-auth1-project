const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./users/User');

mongoose
  .connect('mongodb://localhost/authdb')
  .then(conn => {
    console.log('\n connected to mongo \n');
  })
  .catch(err => console.log('error connecting to mongo', err));

const server = express();

server.post('/api/register', (req, res, next) => {
    const { username, password} = req.body;
    const user = new User({ username, password});

    user
        .save()
        .then(newUser => {
            res.status(201).json(newUser);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

server.post('api/login', (req, res, next) => {
    const { username, password} = req.body;
    User.find({username})
    .then(test => {
       test.validation(this.password).then(valid => {
           if (valid) {
               req.session.name = nameuser;
               res.status(200).json({message: "Logged In"});
           }
       })
       .catch(err => {
        res.status(500).json({message: 'You Shall Not Pass!'});
    })
})
    .catch(err => {
        res.status(500).json({message: 'You Shall Not Pass!'});
    });
});

// server.get('/api/users', (req, res) => {
//     user
// })


server.listen(5000, () => console.log('\n api running on 5k \n'));