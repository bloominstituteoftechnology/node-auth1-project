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

// check if user is logged in
async function restricted(req, res, next) {
  let { username, password } = req.headers;
  try {
    if (username && password) {
      const userData = await db('users')
        .where({ username })
        .first();
      if (userData && bcrypt.compareSync(password, userData.password)) {
        next();
      } else {
        res.status(401).json({ message: 'Invalid credentials.' });
      }
    } else {
      res.status(400).json({ message: 'No credentials provided.' });
    }    
  } catch (error) {
    res.status(500).json({ error });
  }
}

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

// endpoint to login a user
server.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userData = await db('users')
      .where({ username })
      .first();
    console.log("userData: ", userData);
    if (userData && bcrypt.compareSync(password, userData.password)) {
      res.status(200).json({ message: `Welcome ${userData.username}!`});
    } else {
      res.status(401).json({ message: `Invalid login, try again.` });
    }    
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint to get user data IF user is logged in
server.get('/api/users', restricted, async (req, res) => {
  try {
    const usersData = await db('users');
    res.status(200).json(usersData);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = server;