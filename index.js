const express = require('express');
const db = require('./database/dbConfig.js');
const Users = require('./data/users.js');
const server = express();
server.use(express.json());

server.post('/api/register', (req, res) => {
    let user = req.body;
  
  user.password= bcrypt.hashSync(user.password, 10); 
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });