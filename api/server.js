const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('../data/dbConfig.js');
const errors = {
  '19': 'Username taken, pick a different one.'
}

const server = express();

server.use(helmet());
server.use(express.json());

server.get('', (req, res) => {
  res.status(200).json({ message: "Server up!" });
});

// endpoint to register a user
server.post('/api/register', async (req, res) => {
  const userData = req.body;
  if(userData.username && userData.password) {
    // generate hash of user's password
    const hash = bcrypt.hashSync(userData.password, 14);
    // replace password with hash
    userData.password = hash;
    try {
      const [userId] = await db('users').insert(userData);
      res.status(201).json({ userId });
    } catch (error) {
      const msg = errors[error.errno] || error;
      res.status(500).json({ msg });
    }
  } else {
    res.status(400).json({ message: "Please provide username and password." });
  }


});

module.exports = server;