const express = require('express');
const bcrypt = require('bcryptjs');

const dbhelpers = require('./helpers');

const server = express();
const PORT = 4000;

server.use(express.json());

server.post('/api/register', (req, res) => {

});

server.post('/api/login', (req, res) => {

});

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});