const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

const sessionOptions = {
    secret: 'This is the secret',
    cookie: {
        maxAge: 1000 * 60 * 60 //1hr later...
    },
    httpOnly: true,
    secure: false, //only during development
    resave: true,
    saveUninitialized: false,
    
};

function protected(req, res, next) {
    if(req.session) {
        next(); 
    } else {
        res.status(401).json({ message: 'You shall not pass!'});
    }
}

server.use(express.json());
server.use(session(sessionOptions));

server.get('/api/users', protected, (req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

server.get('/', (req, res) => {
    if(req.session && req.session.username) {
    res.status(200).json({ message: `Hello there ${req.session.username}`});
    } else {
        res.status(401).json({message: 'Not acceptable'})
    }
    });


server.post('/api/register', (req, res) => {
    User.create(req.body)
    .then(user => {
        res.status(201).json({message: 'Logged In'});
    })
    .catch(err => {
        res.status(500).json(err)
    });
});

server.post('/api/login', (req, res)=> {
    const { username, password } = req.body;
    User.findOne({ username })
    .then(user => {
        if(user) {
            user
            .validatePassword(password)
            .then(passwordsMatch => {
                if(passwordsMatch) {
                    res.status(200).json ({ message: 'You got it'});
                    req.session.username = user.username;
                } else {
                    res.status(401).send('You shall not pass!');
                }
            })
            .catch(err => {
                res.send('error comparing passwords');
            });
        } else {
            res.status(401).send('You shall not pass!');
        }
    })
    .catch(err => {
        res.send(err);
    });
});

//logout from G.D for reference
/* server.get('/api/logout',(req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            res.send('whoops, there was a problem logging out');
        });
    }
}); */

server.listen(8000, () => {
    console.log('\n*** API running on port 8000 ***\n');
});