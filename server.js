const express = require('express');
const mongoose = require('mongoose');
const server = express();
const User = require('./authenticate/userModel');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n *** ALL SYSTEMS ARE A GO!!! ***\n');
});

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({api: 'Running...'})
});

server.post('/api/register', (req, res) => {
    User
        .create(req.body)
        .then(user => {
            res.status(201).json(user);
        })

        .catch(error => {
            //res.status(500).json({error: "User could not be created", error});
            //"code": 11000,
            if(error.code === 11000) {
                res.status(500).json({error: "Username already taken!"})
            } else {
                res.status(500).json({error: "User could not be created", error});
            }
            
        });

});

server.listen(7227, () => {
    console.log('\n *** THIS API IS BROUGHT TO YOU COURTESY OF PORT 7227 ***\n');
});


