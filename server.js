// import { isValid } from 'ipaddr.js';

const mongoose = require('mongoose');
const express = require('express');
const User = require('./newUser');
const session = require('express-session');

const server = express();

server.use(express.json());
server.use(
    session({
        secret: 'No one knows',
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
        httpOnly: true,
        secure: false, // https wants true. In production we want false
        resave: true,
        saveUninitialized: false,
        name: 'noname',
    })
);
mongoose 
  .connect('mongodb://localhost/AuthDB')
  .then(connect => console.log("\n connected to AuthDB"))
  .catch(err => console.log("error connecting to AuthDB", err))


  function authenticate(req, res, next) {
    if(req.session && req.session.username) {
        next()
    } else {
        res.status(401).send('Nope, not gonna happen')
    }
}

server.get('/', (req, res) => { // TEST GET 
  res.send({ msg: 'Test is successful. GET works' })
})

server.post("/api/register", (req, res) => { // POST NEW USER 
    const userInput = req.body;
    const user = new User(userInput);
    user
    .save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err))
})
  
server.post('/api/login', (req, res) => { // LOGIN WITH CREDENTIALS
    const { username, password } = req.body;

    User.findOne({ username })
    .then(user => {
        if(user) {
            user
            .isPasswordValid(password)
            .then(isValid => {
             if(isValid) {   
                 req.session.username = user.username;
                 res.send('login successful... Have a COOOKIE');
            } else {
                res.status(401).send('password incorrect')
            }
            })
        } else { res.status(401).send('invalid username') }
    })
    .catch(err => res.send(err))
})

server.get('/api/users', authenticate, (req, res) => {
    User
    .find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch( err => { res.status(500).send({ err })})
})

server.get('/api/logout', (req, res) => {
    if(req.session) {
        req.session.destroy(function(err) {
            if (err) {
                res.send('error');
            } else {
                res.send('Adios!');
            }
        });
    }
});


  

const port = 6060;
server.listen(port, () => { console.log(`Server is running on ${port}`); 
})