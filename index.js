const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbHelpers.js');

const server = express();

server.use(express.json());
server.use(cors());

const PORT = 3300;
server.listen(3300, () => {
  console.log(`\nServer is running on PORT ${PORT}\n`);
})