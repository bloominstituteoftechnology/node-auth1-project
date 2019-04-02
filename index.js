//server moduke
const express = require('express');
//security module
const helmet = require('helmet');
//cors?
const cors = require('cors');
//password cryptography
const bcrypt = require('bcryptjs');

//database model
const Users = require('./database/users/users-model.js');

//server initialize
const server = express();

//middleware
server.use(helmet());
server.use(express.json());
server.use(cors());

//CRUD
//root GET
server.get('/', (req, res) => {
    res.send("Server Running");
});

//POST create user/password
server.post('/api/register', (req, res) => {
    let user = req.body;
  //hashing method
    const hash = bcrypt.hashSync(user.password, 4);
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

//server port
const port = process.env.PORT || 7900;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));




