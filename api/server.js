const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const Users = require('../users/users-module.js');
const errors = {
  '19': 'Username taken, pick a different one.'
}

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

const restricted = require('../custom-middlewares/auth.js');

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
      const userId = await Users.addUser(userData);
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
    const userData = await Users.findUserBy({ username });
    console.log("userData: ", userData);
    if (userData && bcrypt.compareSync(password, userData.password)) {
      res.status(200).json({ message: `Welcome ${userData.username}!`});
    } else {
      res.status(401).json({ message: `You shall not pass!` });
    }    
  } catch (error) {
    res.status(500).json(error);
  }
});

// endpoint to get user data IF user is logged in
server.get('/api/users', restricted, async (req, res) => {
  try {
    const usersData = await Users.getUsers();
    res.status(200).json(usersData);
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = server;