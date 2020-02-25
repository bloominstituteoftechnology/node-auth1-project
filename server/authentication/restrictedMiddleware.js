const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('../api/users/usersModel.js');

function restricted(req, res, next){
    const { username, password } = req.headers;
    if(username && password){
        Users.findBy({ username })
            .then(user => {
                if(user && bcrypt.compareSync(password, user.password)){
                    next();
                } else {
                    res.status(401).json({message: `Invalid user credentials.`});
                }
            })
            .catch(error => {
                res.status(500).json({message: `Restriction error: ${error}`});
            })
    } else {
        res.status(400).json({message: `No user credentials provided.`});
    }
}

module.exports = restricted;