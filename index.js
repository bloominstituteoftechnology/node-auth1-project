const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db = require('./data/dbConfig.js');
const Users = require('./users/users-model.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send("It's alive!");
});

//Add POST user and password with hash password

server.post('/api/register', (req, res) =>{
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;
  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(err => {
    res.status(500).json({err: 'Something went wrong!'})
  });

});

//Add POST login  function 

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));