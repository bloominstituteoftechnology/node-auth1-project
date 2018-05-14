const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./User')

//normal boilerplate
mongoose
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== connected to mongo ===\n');
    })
    .catch(err => console.log('error connecting to mongo', err));

const server = express();

function authenticate(req, res, next) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) throw err;
        else user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) {
                console.log(req.body.username + 'failed to login');
                res.status(401).json({ error: 'invalid username/password pair'}) ;   
            };
            console.log(req.body.username + ' has logged in')
            next();
        })
    })
};

//this is the middleware we have created
// function authenticate(req, res, next) {
//     //set a variable equal to hashed input
//     //find database password with username
//     //set variable equal to database password
//     //compare the two passwords
//     //if passwords are the same next
//     //if they are different decline
//     let login
//     bcrypt.hash(this.password, 11, (err, hash) => {
//       if (err) {
//         return next(err);
//       }
//       let login = hash;
//     });
//     let realpassword;
//     User.get('/login', (req, res) => {
//     })
// //rest:
//     if (req.body.password === 'mellon') {
//         next();
//     } else {
//         res.status(401).send('You shall not pass!!!');
//     }
// }


//server.use(greet);
server.use(express.json());

//below is just a check to make sure we can connect to our server
server.get('/', (req, res) => {
    res.send({ route: '/', message: req.message });
});

server.post('/register', function(req, res) {
    const user = new User(req.body);

    user
        .save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(500).send(err));
});

//below fails
server.post('/login', authenticate, (req, res) => {
    res.send('Login Successful, Welcome');
});

//we can insert middleware here, below, right between the route and the parameters, within the middleware,
//next allows you to continue running the .post below
// server.post('/login', authenticate, (req, res) => {
//     res.send('Welcome to the minds of moria!');
// });

//set up server listener
server.listen(8000, () => console.log('\n=== api running on 8k ===\n'));