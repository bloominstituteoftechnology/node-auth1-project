const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./userModel.js');

mongoose.connect('mongodb://localhost/users')
.then(() => {
    console.log('/n*** connected to database ***\n')
})

const server = express();

//middleware
const sessionConfig = {
    secret: "Cats are superior!",
    cookie: {
        maxAge: 1000 * 60 * 60,
    },
    httpOnly: true,
    secure: true,
    resave: true,
    saveUninitialized: false,
    name: 'noname'
};
function protected(req, res, next) {
if(!req.session && !req.session.username) {
    res.status(401)
    res.json({ message: "You shall not pass"})
} else {
    next();
}
}


server.use(express.json());
server.use(session(sessionConfig));

//Routes
server
.get('/', (req,res) => {
    res.status(200).json({ api: "running.." })
});

server
.get('/api/users', protected, (req, res) => {
User
.find()
.then(users => {
    res.status(200)
    res.json({ users })
})
.catch(err => {
    res.status(500)
    res.json({ message: "there has been an error fetching users" })
})
})

server
.post('/api/register', (req, res) => {
User
.create(req.body).then(user => {
    res.status(201)
    res.json(user);
}).catch(err => {
    res.status(500).json({ message: "There has been an error."})
});
})

server
.post('/api/login', (req, res) => {
const { username, password } = req.body;

User
.findOne({ username })
.then(user => {
    if(!user) {
        res.status(401)
        res.json({ message: "username does not exist." });
    }
    else {
    user 
    .validatePassword(password)
    .then(passwordMatch => {
        if (passwordMatch) {
            req.session.username = user.username;
            res.json({ message: "Here's a cookie!" })
        }
        else {
            res.status(401)
            res.json({ message: "invalid password."})
        }
    })
    .catch(err => {
        res.status(500)
        res.json({ message: "Error"})
    })}; 
})
})



//End Routes

server.listen(8000, () => {
    console.log('/n*** API running on port 8k ***\n');
});