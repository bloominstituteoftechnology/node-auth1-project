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

  server.post('/api/login', (req, res) => {
    let { username, password } = req.body;
  
    password= bcrypt.hashSync(user.password, 10); 

    Users.findBy({ username, password })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({ message: `Logged in, ${user.username}` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  if (username && password) {
    Users.findBy({ username})
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
          res.json(users.username)
      } else { err => {
          res.json({message: 'You shall not pass!' })
      }}
    })
    .catch( err => {
        res.status(500).json({ err:err})
    })
}