// Import node modules
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();// creates the server

server.use(express.json());
server.use(cors());

// ROUTES

//Add home route
server.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Add POST ROUTE HANDLER to register/create a user
server.post('/register', (req, res) => {
  const credentials = req.body;

  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users')
    .insert(credentials)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Add GET ROUTE HANDLER to access all users
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

server.listen(3500, () => console.log('\n====running on port 3500====\n'));