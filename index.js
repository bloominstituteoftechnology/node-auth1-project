const express = require('express');
const bcrypt = require('bcryptjs');

const dbHelpers = require('./data/dbHelpers.js');

const server = express();
const PORT = 5111;

server.use(express.json());

server.post('/api/register', (req,res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 15);
    dbHelpers.registerUser(user)
    .then(id => {
      res.status(201).json({id: id[0]});
    })
    .catch(err => {
      res.status(500).json({ error: 'Registration Error' });
    })
  });
  
  server.post('/api/login', (req, res) => {
    const user = req.body;
    dbHelpers.loginUser(user)
    .then(users => {
      if (users.length && bcrypt.compareSync(user.password, users[0].password)) {
        res.status(200).json({ message: 'Success!' });
      } else {
        res.status(400).json({ error: 'Invalid username or password' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Login Error' });
    })
  });

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
