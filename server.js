const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./user/User');

mongoose
    .connect('mongodb://localhost/authprojdb')
    .then(go => {
        console.log('\n== Connected to DB\n');
    })
    .catch(err => {
        console.log('\nMUST CONSTRUCT MORE PYLONS!\n', err);
    });

const server = express();
const sessionConfig = {
    secret: 'Cookie Monster Is Coming For You',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    }, // 1 day in milliseconds
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'noname',
    store: new MongoStore({
        url: 'mongodb://localhost/sessions',
        ttl: 60 * 10, //seconds
    }),
}

server.use(express.json());
server.use(session(sessionConfig));

function authenticate(req, res, next) {
    if (req.session && req.session.username) {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
}

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.send(`Welcome Back ${req.session.username}`);
    } else {
        res.send('DOES NOT COMPUTE!');
    }
});

server.post('/api/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).send(err);
        });
})

server.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username })
        .then(user => {
            if (user) {
                //compare the passwords
                user
                    .isPasswordValid(password)
                    .then(isValid => {
                        if (isValid) {
                            req.session.username = user.username;
                            res.send('Login Successful - Here is a Cookie!');
                        } else {
                            res.status(401).send('Invalid Password');
                        }
                })
            } else {
                res.status(401).send('Invalid Username');
            }
        })
        .catch(err => res.send(err));
});

server.get('/api/user', authenticate, (req, res) => {

    User
        .find()
        .then(users => {
            res.status(200).json(users);
        });
        // .catch(err => {
        //     res.status(500).json(err);
        // });
});

server.get('/api/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Good Riddance!');
            }
        });
    }
});

server.listen(8000, () => console.log('\n== Listening...\n'));