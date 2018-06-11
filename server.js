const express = require('express');
const connectionToDB = require('./db/db');

const server = express();

connectionToDB.connectTo('auth_i');

const PORT = 6666;
server.listen(PORT, () => console.log(`\n**** Yuhuuu! Server listening at port ${PORT} ****\n`));
