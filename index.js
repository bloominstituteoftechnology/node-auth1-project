// dependencies
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

// server
const server =  express();

// middleware
server.use(express.json());
server.use(cors());

// test
server.get('/', (req, res) => {
    res.send('testing!');
});

// endpoints
server.get('/api/users', (req, res) => {
    db('users')
        .select('id', 'username')
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                res.status(500).json(err);
            });
})

server.post('/register', (req, res) => {
    const credentials = req.body;
    const hash = bcrypt.hashSync(credentials.password, 14);
    credentials.password = hash;

    db('users')
        .insert(credentials)
            .then(ids => {
                
            })
            .catch();
});

server.post('/login', (req, res) => {
    const credentials = req.body;
    db('users')
        .then()
        .catch();
})

// port
const port = 3333;
server.listen(port, () => console.log(`==listening on port ${port}==`));