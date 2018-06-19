const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const server = express();
const User = require('./authenticate/userModel');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n *** ALL SYSTEMS ARE A GO!!! ***\n');
});

//middleware
const sessionSetup = {
    secret: "I am the very model of a modern major general!",
    cookie : {
        maxAge: 1000 * 60 * 60 * 24 //1 day in MS
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: true,
    name: "you wish",
};

function onlyLoggedIn(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send("NOT MY SERVER B***H!!!!")
    }
}

server.use(express.json());
server.use(session(sessionSetup));

server.get('/api/users', onlyLoggedIn, (req, res) => {
    User
        .find()
        .then(users => res.json(users))
        .catch(err => res.json(err));
})

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.status(200).json({message: `Welcome Back ${req.session.username}`});
    } else {
        res.status(400).json({message: "IDENTIFY YOURSELF!!!"});
    }
    
});

server.post('/api/register', (req, res) => {
    User
        .create(req.body)
        .then(user => {
            res.status(201).json(user);
        })

        .catch(error => {
            if(error.code === 11000) {
                res.status(500).json({error: "Username already taken!"})
            } else {
                res.status(500).json({error: "User could not be created", error});
            }
            
        });

});

server.post('/api/login', (req, res) => {
    const { username, password} = req.body;

    User
        .findOne({ username })
        .then(user => {
            if(user) {
                user
                    .validatePassword(password)
                    .then(passwordsMatch => {
                        if (passwordsMatch) {
                            req.session.username = user.username;
                            res.status(201).json({message: 'Have a Cookie'});
                        } else {
                            res.status(401).json({error: 'Invalid Credentials'});
                        }
                    })
                    .catch(err => {
                        res.status(401).json({error:'Password does not match'});
                    });
                } else {
                    res.status(401).json({error: "Invalid Credentials"});
                }
            })

        .catch(err => {
            res.send(err);
        });
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy (err => {
            if (err) {
              res.send('Cannot Logout');  
            } else {
                res.send('Until Next Time...')
            }
        }); 
    }
});

server.listen(7227, () => {
    console.log('\n *** THIS API IS BROUGHT TO YOU COURTESY OF PORT 7227 ***\n');
});


