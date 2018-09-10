const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');

const db = require('./db/dbConfig');

const server = express();

server.use(helmet());
server.use(express.json());

// ####### Checking if the server is running #######
server.get('/', (req, res) => {
    res.send('API running....')
});

// ###### Getting all the users ########
server.get('/users', (req, res) => {
    db('users')
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json({Message: 'Can not get users!', error})
        })
})

// ######### Registering new user #############
server.post('/register', (req, res) => {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 14);
    newUser.password = hash;

    db('users')
        .insert(newUser)
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

server.listen(5000);