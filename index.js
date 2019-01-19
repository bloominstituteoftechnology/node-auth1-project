const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cors = require('cors');

const dbhelpers = require('./helpers');

const server = express();
const PORT = 4000;

/* Middleware */
server.use(express.json());
server.use(cors());
server.use(
session({
    name: 'notsession', // default is connect.sid
    secret: 'sauce..........,,,,,,,,,,!!!!!!!!!!',
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
        secure: false, // Allow setting cookie over http. Insecure...
    }, 
    httpOnly: true, 
    resave: false,
    saveUninitialized: false,
    })
);

/* Endpoints */
server.post('/api/register', (req, res) => {
    const user = req.body;
    // Make sure the user post has both a username and password
    if (user.username && user.password) {
        // Hash the password before sending it onto our dbhelper
        user.password = bcrypt.hashSync(user.password, 14);
        dbhelpers.addUser(user)
        .then((userId) => {
            res.status(201).json({message: `User created with an ID of: ${userId}`});
        })
        .catch((error) => {
            res.status(500).json({error: `Server sent an error of: ${error}`});
        })
    }
    else {
        res.status(400).json({message: 'Registering a user requires both a username and password.'});
    }
});

server.post('/api/login', (req, res) => {
    const userFromBody = req.body;
    if (userFromBody.username && userFromBody.password) {
        dbhelpers.getUser(userFromBody.username)
        .then((user) => {
            if (user.length && 
                bcrypt.compareSync(userFromBody.password, user[0].password)) {
                    req.session.userID = user[0].id;
                    res.status(200).json({message: `User ${user[0].username} logged in...`});
                }
            else {
                // I'm a teapot status code!
                res.status(418).json({message: 'Username or password not recognized.'});
            }
        })
        .catch((error) => {
            res.status(500).json({error: `Server sent an error of: ${error}`});
        })
    }
    else {
        res.status(400).json({message: 'Logging in requires both a username and password'});
    }
});

server.get('/api/users', (req, res) => {
    if (req.session && req.session.userID) {
        dbhelpers.getUsernames()
        .then((usernames) => {
            res.status(200).json({usernameList: usernames});
        })
        .catch((error) => {
            res.status(500).json({message: `Server sent an error of: ${error}`});
        })
    }
    else {
        res.status(403).json({message: 'You need to login to get access to this resource.'});
    }
})

/* Listening post */
server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});