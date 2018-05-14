const express = require('express');
const mongoose = require('mongoose');

const User = require('./users/User');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {

});

server.listen(8000, () => console.log('\n=== api running on port 8000===\n'));
