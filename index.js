const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile')
const bcrypt = require('bcryptjs');
const db = knex(knexConfig.development);
const Users = require('./users/users-model.js');
const server = express();
server.use(express.json());

server.get('/', (req, res) => {
    res.send("It's alive!");
  });

server.post('/api/register', (req, res) => {
    let user = req.body;
    // generate hash from user's password
    const hash = bcrypt.hashSync(user.password, 12); // 2^ n
    // override user.password with hash
    user.password = hash 
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });



const port = process.env.PORT || 5000;
server.listen(port, ()=> console.log(`\n Running on ${port}\n`))
