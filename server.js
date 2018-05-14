const express = require('express');
const mongoose = require('mongoose');
const User = require('./users/User');

mongoose
    .connect('mongodb://localhost/auth')
    .then(conn => {
        console.log('\n=== connected to mongo ===\n'); 
    })
    .catch(err => console.log('error connecting to mongo', err)); 

const server = express();

function authenticate(req, res, next) {
    if (req.body.password === 'pugbutts') {
        next();
    } else {
        res.status(401).send('You shall not pass!')
    }
}

server.use(express.json());

//GET
//Postman Test ok! http://localhost:8000
server.get('/', (req, res) => {
    res.send({ route: '/', message: req.message });
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
server.post('/login', authenticate, (req, res) => {
    res.send('Logged in');
});

//GET /api/users
server.get('/users', (req, res) => {
    res.send({ route: '/', message: req.message });
});

server.use(express.json());

server.listen(8000, () => console.log('\n=== API RUNNING on 8000 ===\n')); 