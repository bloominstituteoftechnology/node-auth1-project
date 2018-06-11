const express = require('express');
const mongoose = require('mongoose');

const User = require('./userModel');

mongoose
.connect('mongodb://localhost/auth-i')
.then(() => { console.log('\n*** Connected to database ***\n');})
.catch(error => console.log('\n!!!Error connecting to DB!!!\n', error));

const server = express();

server.use(express.json());

server.get('/', (req, res)=> {
    res.status(201).json('Server Running')
});

server.post('/api/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        })
})


const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`\n*** API running on port ${port} ***\n`);
});