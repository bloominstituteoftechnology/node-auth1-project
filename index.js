const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

PORT = 7700;

server.get('/', (req, res) => {
    res.send(`Running on ${PORT}`)
})

//POST REGISTER REQUEST
server.post('/api/register', (req, res) => {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password);
    db('users').insert(user)
      .then(id => {
        res.status(201).json({ id: id });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  });
  
  server.post('/api/login', (req, res) => {
    // CHECK THAT USERNAME EXISTS AND THAT PASSWORDS MATCH
    const bodyUser = req.body;
    db('users').where('username', bodyUser.username)
      .then(users => {
        // USERNAME VALID (1ST CHECK)
        // PASSWORD FROM CLIENT = PASSWORD FROM DATABASE (2ND CHECK)
        if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
          res.json({ info: "correct" })  
        } else {
          res.status(404).json({err: "Invalid username or password"})
          }
      })
      .catch(err => {
        res.status(500).send(err);
    })
  });
  
  // PROTECTED ROUTE, ONLY VISIBLE TO AUTHENTICATED USERS
  server.get('/api/users', (req, res) => {
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);
      })
      .catch(err => res.send(err));
  });




server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
