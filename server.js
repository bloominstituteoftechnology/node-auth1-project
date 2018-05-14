const express = require('express');
const mongoose = require('mongoose');

mongoose
    .connect('mongodb://localhost/authprojdb')
    .then(go => {
        console.log('\n Connected to DB \n');
    })
    .catch(err => {
        console.log('\n MUST CONSTRUCT MORE PYLONS! \n', err);
    });

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send('API IS LIT FAM')
});

server.listen(8000, () => console.log('Listening...'));