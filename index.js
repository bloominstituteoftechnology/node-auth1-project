const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.listen(3000, () => console.log('\n Server is running on port 3000 \n' ));