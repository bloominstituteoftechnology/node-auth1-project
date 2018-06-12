const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const userRouter = require('./users/userRouter.js');

mongoose.connect('mongodb://localhost/authidb').then(() => {
    console.log('\n *** Connected to authidb database ***\n');
});

const server = express();

const sessionOptions = {
    secret: 'I dont know',
    cookie: {
        maxAge: 1000 * 60 * 60,
    },
    httpOnly: true,
    secure: false,
    resave: true,
    saveUninitialized: false,
    name: 'anonymous',
}

function protected(req, res, next) {
    if (req.path.includes('restricted')) {
        if (req.session && req.session.username) {
            next();
        } else {
            res.status(401).json({ message: 'Please login and try again.'})
        }
    } else {
        next();
    }
}

server.use(express.json());
server.use(session(sessionOptions));
server.use(protected);

server.use('/api', userRouter);

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.status(200).json({ api: `logged in as ${req.session.username}`});
    } else {
        res.status(401).json({ message: 'Please log in' })
    }
});

const port = 5000;
server.listen(port, () => { console.log(`\n*** API running on port ${port} ***\n`)});