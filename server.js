const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const server = express();
const session = require('express-session');

const User = require('./users/userModel')

mongoose.connect('mongodb://localhost/user')
        .then(() => {
            console.log('connected to database')
        })
        .catch(err => {
            console.log('database connection failed')
        })

server.use(express.json())

server.use(
    session({
        secret: 'en buyuk fener',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
        httpOnly: true,
        secure: false,
        saveUninitialized: false,
        resave: true,
        name: 'noname'
    }) 
)

server.get('/', (req, res) => {
    if(req.session && req.session.username) {
        res.json({message: `welcome back ${req.session.username}`})
    }else {
    res.json({api: 'running'})}
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
                // bcrypt.compare(passwordGuess, user.password) => {
                user.isPasswordValid(password).then(isValid => {
                    if(isValid) {
                        req.session.username = user.username
                        res.send('login successful, have a cookie')
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

server.get("/users", (req, res, next) => {
      if (req.session.username) {
            User.find()
                  .then(users => {
                        res.status(200).json(users);
                      })
                  .catch(error => {
                        res.status(500).json(error);
                      });
          } else {
            res.status(401).json({ error: "You shall not pass" });
          }
    });


server.listen(5000, () => {
    console.log('api running on port 5000')
})

