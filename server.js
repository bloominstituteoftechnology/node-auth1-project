const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./users/User');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


mongoose
    .connect('mongodb://localhost/auth')
    .then(conn => {
        console.log('\n=== connected to mongo ===\n'); 
    })
    .catch(err => console.log('error connecting to mongo', err)); 

const server = express();

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You shall not pass!')
    }
}

const sessionConfig = {
    secret: 'shh it is a secret', 
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, 
    }, //1 day in milliseconds
    httpOnly: true, 
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10,
    }),
};

server.use(express.json());
server.use(session(sessionConfig));

//GET
//Postman Test ok! http://localhost:8000
server.get('/', (req, res) => {
    if (req.session && req.session.username) {
    // res.send({ route: '/', message: req.message });
    res.send(`Welcome Back ${req.session.username}`);
  } else {
    res.send('Invalid Credentials');
  }
});

//POST /api/register
//Postman Test ok! http://localhost:8000/register
server.post('/register', function(req, res) {
    const user = new User(req.body);

    user
    .save()
    .then(user => res.status(201).send(user))
    .catch(err => res.status(500).send(err));
});

//POST /api/login
//Postman Test ok! http://localhost:8000/login
server.post('/login', (req, res) => {
    const { username, password } = req.body;

User.findOne({ username })
    .then(user => {
        if (user) {
            user.isPasswordValid(password).then(isValid => {
                if(isValid) {
                    req.session.username = user.username;
                    res.send('Logged in');
                } else {
                    res.status(401).send('invalid password');
                }
            });
        } else {
            res.status(401).send('invalid username');
        }
    })
    .catch(err => res.send(err));
});

//GET /api/users
//Postman Test ok! http://localhost:8000/users
server.get('/users', authenticate, (req, res) => {
    User.find()
    .then(users => res.send(users));
});

//GET /api/logout
//Postman Test ok! http://localhost:8000/logout
server.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) {
          res.send('error');
        } else {
          res.send('Good Bye');
        }
      });
    }
  });

server.listen(8000, () => console.log('\n=== API RUNNING on 8000 ===\n')); 