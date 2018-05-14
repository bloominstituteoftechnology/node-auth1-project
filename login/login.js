const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Register = require('../register/register');

function authenticate(req, res, next) {
    const username = Register.username;
    const password = Register.password;
    if (req.body.username === username && req.body.password === password) {
        next();
    } else {
        res.status(401).send('You shall not pass!');
    }
}

router 
    .post('/', authenticate, (req, res) => {
        console.log('Logged In');
    });

module.exports = router;