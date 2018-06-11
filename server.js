const express = require('express');
const mongoose = require('mongoose');

const User = require('./authenticate/UserSchema');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n');
});

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({ api: 'running...' });
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json(error.message);
        })
});

// server.post('/api/login', (req, res) => {
//     const { id, username, password } = req.body;
//     User.find({ username: { $regex: username }, password: password })
//         .then(user => {
//             console.log(user.password);
//             res.status(200).json(`Logged In`);
//         })
//         .catch(error => {
//             res.status(400).json('You shall not pass.');
//         })
// })

server.listen(61118, () => {
    console.log('\n*** API running on port 61118 ***\n');
}); 