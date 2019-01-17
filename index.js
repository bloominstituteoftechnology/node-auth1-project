const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbHelpers.js');

const server = express();
const PORT = 4400;

server.use(express.json());

// register new user with hashed password

server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 14);
    if (user.password && user.username) {
        db
        .insert(user)
        .then(id => {
            res
                .status(201)
                .json({id: id[0]})
        })
        .catch(err => {
            res
                .status(500)
                .json({message: `Registration could not be completed at this time.`})
        });
    }
    else {
        res
            .status(400)
            .json({message: `Please provide both a username and password for registration.`})
    }
});

// log in with hashed password

server.post('/api/login', (req, res) => {
    const user = req.body;
});

server.listen(PORT, () => console.log(`Running on ${PORT}`));