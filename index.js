const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcrypt');

const db = require('./db/helpers/helper');

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', (req, res) => {
    res.send('API running....')
});


server.listen(5000);