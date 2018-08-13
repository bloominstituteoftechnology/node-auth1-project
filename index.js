const express = require('express');
const db = require('./data/db.js');
const server = express();

server.use(express.json());



server.listen(3300, () => console.log('\n==== API is running... ====\n'))