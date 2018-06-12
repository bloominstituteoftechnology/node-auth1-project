const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/auth-i')
    .then(
        () => {
            console.log('\n*** Connected to Database***\,');
    })

const app = express();

const sessionOptions = {
    secret: 'nobody tosses a dwarf!',
    cookie: {
        maxAge: 1000 * 60 * 60
    },
    httpOnly: true,
    secure: false,
    resave: true,
    savedUninitialized: false
}

app.use(express.json());
app.use(session(sessionOptions));
app.use(cors());
app.use(helmet());

function protected(req, res, next) {
    if (req.session) {
        next();
    } else {
        res.status(401).json({ message: 'Please try again.' })
    }
}


app
    .get('/', (req, res) => {
        res.status(200).json({ message: `Welcome back ${ req.session.user }` });
    })

app
    .post('/api/register', (req, res) => {
        User.create(req.body)
            .then(user => {
                res.status(201).json(user);
            })
            .catch(error => {
                res.status(500).json(error);
            });
    })

app
    .post('/api/login', (req, res) => {
        const { username, password } = req.body;
        User
            .findOne({ username })
            .then(user => {
                if (user) {
                    user.validatePassword(password)
                        .then(passwordsMatch => {
                            if(passwordsMatch) {
                                req.session.username = user.username;
                                res.send('Have a cookie.');
                            } else {
                                res.send('Invalid credentials.');
                            }
                        })
                } else {
                    res.status(401).send('Invalid credentials.')
                }
            })
            .catch(error => {
                res.send(error);
            })
    })

app
    .get('/api/logout', (req, res) => {
        if(req.session) {
            req.session.destroy(error => {
                if(error) {
                    res.send('Error logging out.');
                } else {
                    res.send('Goodbye.');
                }
            })
        }
    })

app
    .get('/api/users', protected, (req, res) => {
        User.find()
            .then(users => {
                res.json(users)
            })
            .catch(error => {
                res.json(error)
            })
    })

port = 5001;

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});