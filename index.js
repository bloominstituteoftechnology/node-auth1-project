const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbHelpers.js');

const server = express();
const PORT = 4400;

server.use(express.json());

server.listen(PORT, () => console.log(`Running on ${PORT}`));