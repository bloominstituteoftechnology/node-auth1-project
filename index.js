const express = require('express');
const bcrypt = require('bcryptjs');

const dbhelpers = require('./helpers');

const server = express();
const PORT = 4000;

server.use(express.json());

server.post('/api/register', (req, res) => {
    const user = req.body;
    // Make sure the user post has both a username and password
    if (user.username && user.password) {
        // Hash the password before sending it onto our dbhelper
        user.password = bcrypt.hashSync(user.password, 14);
        dbhelpers.addUser(user)
        .then((userId) => {
            res.status(201).json({message: `User created with an ID of: ${userId}`});
        })
        .catch((error) => {
            res.status(500).json({error: `Server sent an error of: ${error}`});
        })
    }
    else {
        res.status(400).json({message: 'Registering a user requires both a username and password.'});
    }
});

server.post('/api/login', (req, res) => {
    const user = req.body;

});

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});