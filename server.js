const express = require('express');
const mongoose = require('mongoose');

const Register = require('./register/register');

mongoose 
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== connected to mongo db ===\n');
    })
    .catch(err => console.log('error connecting to db', err));

const server = express();

server.use(express.json());
server.use('/register', Register);

server.get('/', (req, res) => {
    res.send({ api: 'running' });
});

server.listen(5000, () => console.log(`\n=== api running on ${port} ===\n`));