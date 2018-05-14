const express = require('express');
const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/auth')
    .then(conn => {
        console.log('\n=== connected to mongo ===\n'); 
    })
    .catch(err => console.log('error connecting to mongo', err)); 

const server = express();

function authenticate(req, res, next) {
    if (req.body.password === 'pugbutts') {
        next();
    } else {
        res.status(401).send('Sorry the password is invalid.')
    }
}

//GET
server.get('/', (req, res) => {
    res.send({ route: '/', message: req.message });
});

server.use(express.json());

server.listen(8000, () => console.log('\n=== API RUNNING on 8000 ===\n')); 