const express = require('express');
const server = express();
const knex = require('knex');
const bcrypt = require('bcryptjs');

// const db = require('./database/dbConfig.js');

const PORT = process.env.PORT || 3300;

server.use(express.json());
// server.use(cors());

server.get('/', (req, res) => {
  res.send('I am responding to your GET request, Dave!');
});

// server.listen(3300, () => console.log('I live therefore I AM running on port 3300'));
server.listen(PORT, () => {
  console.log(`I live therefore I AM running on port ${PORT}`);
});