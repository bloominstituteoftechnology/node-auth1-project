const express = require('express');
const cors = require('cors');
const db = require('./database/dbConfig.js');
const bcrypt = require('bcryptjs')


//POST to /api/register
//POST to /api/login
//GET to /api/users
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
    res.send('Server is running properly');
});

server.listen(9000, () => console.log('\nrunning on port 9000\n'));