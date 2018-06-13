const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const User = require('./auth/UserModel');

mongoose.connect('mongodb://localhost/authdb').then(() => {
    console.log('\n*** Connected to database *** \n'); 
})
.catch(err => {
    console.log('error connecting to database', err)
});

const server = express();

server.use(express.json());

// middleware
    // local middleware
function authenticate(req, res, next) { 
    
    if (req.session && req.session.username) { // if that username is not there then they havent logged in
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
}

    // global middleware
server.use( 
    session({
        secret: 'nobody tosses a dwarf!',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 }, // 1 day in milliseconds // session expiration time
        httpOnly: true,
        secure: false, // use false for development. Whoever does deployment may later change to true if there's a need for secure network (i.e https)
        resave: true, 
        saveUninitialized: false,
        name: 'noname', // we dont want hackers to know which library we're using, so use a generic name
        store: new MongoStore({
            url: 'mongodb://localhost/sessions',
            ttl: 60 * 10, // time to live in seconds
        }),
    })
);

// end of middleware

server.get('/', (req, res) => {
    if(req.session && req.session.username) {
        res.json(`Welcome back ${req.session.username}`)
    } else {
        res.json('Who are you?');
    }
})

// REGISTER
server.post('/api/register', (req, res) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Please provide a username and password to continue"})
        return;
    }
    User.create(req.body).then(user => {
        res.status(201).json(user);
    }).catch(err => {
        res.status(500).json(err)
    });
})

// LOGIN
server.post('/api/login', (req, res) => {
    //grab credentials
    const { username, password } = req.body;
    // find the user to get access to the stored password
    User.findOne({ username })
        .then(user => {
            if(user) {
                // compare the passwords
                user.isPasswordValid(password).then(isValid => { //isPasswordValid is defined in UserModel.js
                    if(isValid) {
                        // if user exists and password is valid, persist username inside req.session object // after you login the first time, the library will add a session object to req
                        req.session.username = user.username; // by this point, we know the user exists and the password is valid
                        res.send('login successful')
                    } else {
                        res.status(401).json('invalid credentials!') // use 401 instead of 404 so not to give away that user doesn't exist
                    }
                })
            } else {
                res.status(401).json('invalid credentials!')
            }
        })
})

// USERS // if server restarts, will have to send post request to login route again otherwise will run into error: You shall not pass! This is b/c the session exists in memory and does not persist across server restarts.
server.get('/users', authenticate, (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        })
});


// LOGOUT 
server.get('/logout', (req, res) => {
    if(req.session) { // check to see if session exists, otherwise will get error saying -- cannot call destroy on undefined
        req.session.destroy(function(err) {
            if(err) {
                res.send('error logging out');
            } else {
                res.send('good bye');
            }
        })
    }
});


server.listen(3000, () => { 
    console.log('\n*** API running on post 3k *** \n'); 
});