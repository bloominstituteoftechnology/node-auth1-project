const express = require('express');
const mongoose = require('mongoose')

const User = require('./auth/UserModel');
const Login = require('./auth/LoginModel')

mongoose.promise = global.Promise;
mongoose.connect('mongodb://localhost/auth').then(() => {
    console.log('\n***Connected to db ***\n');
});

const server = express();
server.use(express.json());

server.get('/', (req, res) =>{
    res.status(200).json({api: 'running....'})
});

server.post('/api/register', (req, res) => {
    User
    .create(req.body)
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err =>{
        res.status(500).json({error: 'You could not register, please try again.'})
    })
})

server.post('/api/login', (req, res) => {
    const {password} = req.body
    Login
    .find(function(err, password){
        if(err) return handleError(err)
    })
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err =>{
        res.status(500).json(err)
    })
})

server.get('/api/users', (req, res) => {
    User
    .find()
    .populate()
    .then(user => {
        res.status(200).json(user)
    })
    .catch(err => {
        res.status(500).json(err)
    })
})




server.listen(5000, () => {
    console.log('\n***API running on port 5000***\n')
});