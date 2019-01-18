// Define dependancies
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./database/dbHelpers.js');
const session = require('express-session');

const server = express();

// Set up use's && session
server.use(express.json());
server.use(cors());
server.use(session({
    name: 'notsession',
    secret: 'lmao',
    cookie: (
        maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    ),
    httpOnly: true, // Js get off my cookies
    resave: false,
    saveUninitialized: false,
}));

server.get('/',(req,res) => {
    res.send("SERVER rUnNiNg");
});
