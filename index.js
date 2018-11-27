const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); //added package and required it here

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());
server.use(cors());

//sanity check
server.get('/', (req, res) => {
  res.send("It's Alive!");
});

server.post('/api/register', (req, res) => {
  //grab username and password from the body
  const creds = req.body;
  //generate the hash from the user's password
  const hash = bcrypt.hashSync(creds.password, 14); //rounds is 2^X
  //override the user.password with the hash
  creds.password = hash;
  //save the user to the database
  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err =>
      res.status(400).json({ message: 'Registration failed.', error: err })
    );
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //passwords match and user exists by that username
        res.status(200).json({ message: 'Welcome!' });
      } else {
        //either username is invalid or password is wrong
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(err => res.json(err));
});

//protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password') //added password to the select
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = 8800;
server.listen(port, function() {
  console.log('\nrunning on port 8800\n');
});
