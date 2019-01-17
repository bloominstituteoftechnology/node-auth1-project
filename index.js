const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const morgan = require('morgan');

const db = require('./data/dbHelpers.js');
const server = express();
const PORT = 4500;

server.use(express.json());
server.use(cors());
server.use(morgan('dev'));

server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});