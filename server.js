const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/auth-i').then(() => {
    console.log('\n*** Connected to database ***\n')
})

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.status(200).json({api: 'running...'})
});

server.listen(3000, () => {
    console.log('\n*** API running on port 3K ***\n')
});