const express = require('express');
const mongoose = require('mongoose');
// const session = require('express-session');
// const User = require('./auth/UserModel');
const UserController = require('./auth/UserController');

const server = express();

server.use(express.json());


//middleware
// const sessionOptions = {
//     secret: 'nobody tosses a dwarf!',
//     cookie: {
//         maxAge: 1000 * 60 * 60, // set to expire in an hour (written in milli-seconds)
//     },
//     httpOnly: true, // only send on http requests
//     secure: false, //only send on https - the secure version of http
//     resave: true,
//     savedUnititalized: false,
//     name: 'noname',
// }


// server.use(session(sessionOptions));

server.use('/', UserController);

//'mongodb' is persistent protocol (it's stateful and stays open) where as 'http' is stateless ( you make the request and the connection is severed after the response is complete.)
mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n')
});





server.listen(3000, () => {
    console.log('\n*** API running on port 3K ***\n')
});

