const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const Register = require('./register/register');
const Login = require('./login/login');
const sessionConfig = require('./login/login');

mongoose 
    .connect('mongodb://localhost/authdb')
    .then(conn => {
        console.log('\n=== connected to mongo db ===\n');
    })
    .catch(err => console.log('error connecting to db', err));

const server = express();

server.use(express.json());
server.use(session(sessionConfig));
server.use('/register', Register);
server.use('/login', Login);

server.get('/', (req, res) => {
    res.send({ api: 'running' });
});

server.listen(5000, () => console.log(`\n=== api running on port 5000 ===\n`));