const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();
const port = 8000;

server.use(express.json());

server.listen(port, console.log(`\nWeb API running on http://localhost:${port}\n`));
