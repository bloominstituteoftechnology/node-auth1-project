const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();


const User = require('../users/User');

function authenticate(req, res, next) {
    
}

router 
    .post('/', authenticate, (req, res) => {
        console.log('Logged In');
    });

module.exports = router;