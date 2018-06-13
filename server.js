const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const User = require('./auth/UserModel.js');

mongoose.connect('mongodb://localhost/user')
    .then(() => {
        console.log('\n*** Connected to db***\n');
    })
    .catch(err => {
        console.log('\n***database connection failed***\n')
    })

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({api: "running!"});
});

server.post('/register', (req, res) => {
    const newUser = new User(req.body);
    if(!newUser.username || !newUser.password){
        res.status(400).json({error: "Please provide both username & password."})
        return;
    }
    User.create(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
});

server.post('/login', (req, res) => {
    const {username, password} = req.body;
    User.findOne({username})
        .then(user => {
            if(user){
                user.isPasswordValid(password).then(isValid => {
                    if(isValid){
                        req.session.username = user.username
                        res.send('have a cookie')
                    } else {
                        res.status(401).send('invalid creds');
                    }
                })
            } else {
                res.status(401).send('invalid creds');
            }
        })
        .catch(err => res.status(500).send(err));
})

server.get('/users', (req, res, next) => {
    if(req.session.username){
        User.find()
            .then(users => {
                res.status(200).json(users);
            })
            .catch(error => {
                res.status(200).json(error);
            });
    } else {
        res.status(401).json({error: "Please try again."});
    }
});

server.get('/logout', (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                res.send('error logging out');
            }else {
                res.send('Goodbye!')
            }
        })
    }
})

server.listen(8001, () => {
    console.log('\n***API running on port 8001***\n');
});