const express = require('express');
const connectionToDB = require('./db/db');

connectionToDB.connectTo('auth_i');
const server = express();

const PORT = 6666;
server.listen(PORT, () => console.log(`\n**** Yuhuuu! Server listening at port ${PORT} ****\n`));
