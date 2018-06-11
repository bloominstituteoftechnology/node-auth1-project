const express = require('express');
const mongoose = require('mongoose');
// const User = require('./auth/UserModel');


//'mongodb' is persistent protocol (it's stateful and stays open) where as 'http' is stateless ( you make the request and the connection is severed after the response is complete.)
mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n')
})

const server = express();

server.use(express.json());

// server.get('/', (req, res) => {
//     res.status(200).json({api: 'running...'})
// });

// server.post('/api/register', (req, res) => {
//     // traditional way of getting db info
//     // const { username, password } = req.body;

//     // save the user to the database
//     User.create(req.body)
//         .then(user => {
//             res.status(201).json(user);
//         })
//         .catch(err => {
//             res.status(500).json(err);
//         });
// });


server.listen(3000, () => {
    console.log('\n*** API running on port 3K ***\n')
});