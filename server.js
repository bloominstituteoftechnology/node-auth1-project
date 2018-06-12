const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const User = require('./users/UserModel');
const localHost = 'localhost:27017';
const database = 'usersdb';
const server = express();
const port = process.env.PORT || 8000;

mongoose
    .connect(`mongodb://${localHost}/${database}`)
    .then(response => {
        console.log("Connection Successful")
    })
    .catch(error => {
        console.log("Connection Failed")
    });

// function authenticate(req, res, next) {
//     console.log("authentication", req.session)
//     if(req.session && req.session.username) {
//         next();
//     } else {
//         res.status(401).send("You Shall Not Pass!")
//     }
// }

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(
    session({
        secret: 'nobody tosses a dwarf!',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
        httpOnly: false,
        secure: false,
        resave: true,
        saveUninitialized: false,
        name: "noname"
    })
);

server.get('/', (req, res) => {
    if (req.session && req.session.username) {
        res.send(`Welcome Back, ${req.session.username}`)
    } else {
        res.send("Login Attempt Unsuccessful")
    }
});

server.get('/users',(req, res) => {
    if(!req.session && !req.session.username) {
        res.status(401).send("You Shall Not Pass!")
    } else {
    User
        .find()
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(error => {
            res.status(500).error("YOU SHALL NOT PASS!")
        })
    }
})

server.post('/register', (req, res) => {
    console.log(req.body)
    User
        .create(req.body)
        .then(user => {
            res.status(201).json({ success: "New User Added to Database", user })
        })
        .catch(error => {
            res.status(500).error({ error: error.message })
        })
})

server.post('/login', (req, res) => {
    const { username, password } = req.body;
    User
        .findOne({ username })
        .then(user => {
            if(user) {
                user
                    .isPasswordValid(password)
                    .then(isValid => {
                        if(isValid) {
                            req.session.username = user.username;
                            res.send("Login Successful")
                        } else {
                            res.status(401).send("Invalid Credentials")
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error: error.message })
                    })
            } else {
                res.status(401).send("Invalid Credentials")
            }
        })
        .catch(error => {
            res.status(500).error({ error: error.message })
        })
})

server.get('/logout', (req, res) =>{
    if (req.session) {
        req.session.destroy(error => {
            if(error){
                res.send('error logging out')  
            } else {
                res.status(200).send("Have a nice day!")
            }
        })
    }
})

server.listen(port, () => {
    console.log(`\n=== API up on port: ${port} ===\n`);
});
