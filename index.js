const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('I live therefore I AM!');
});

server.listen(3300, () => console.log(`I live therefore I AM running on port 3300`));
