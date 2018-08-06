const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

// Endpoints Here

server.listen(3300, function() {console.log('API is running on 3300')});