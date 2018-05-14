const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authProjectdb')
.then(conn => {
    console.log('\n== Connected to Database! ==\n')
})
.catch(err => {
    console.log('\n== Error connecting to database, sorry! ==\n')
})

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('Connected')
});

server.post('/register', function(req, res) {
    .then()
    .catch()
})

server.post('/login', function(req, res) {
    .then()
    .catch()
})

server.get('/users', function(req, res) {
    .then()
    .catch()
})

server.listen(5000, () => console.log('Server running on port 5000'));