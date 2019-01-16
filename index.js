const express = require('express');
const bcrypt = require('bcryptjs');
const logger = require('morgan');
const db = require('./knexfile');

const PORT = 4444;
const server = express();

server.use(
    express.json(),
    logger('dev')
);



server.listen(PORT, ()=> console.log(`server running on port: ${PORT}`));
