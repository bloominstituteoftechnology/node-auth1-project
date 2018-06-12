const express = require('express');
const mongoose = require('mongoose');
// const User = require('./auth/UserModel');
const UserController = require('./auth/UserController');

const server = express();

server.use(express.json());

server.use('/', UserController);

//'mongodb' is persistent protocol (it's stateful and stays open) where as 'http' is stateless ( you make the request and the connection is severed after the response is complete.)
mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n')
});


server.listen(3000, () => {
    console.log('\n*** API running on port 3K ***\n')
});

