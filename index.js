const express = require('express');
const cors = require('cors');
const knex = require('knex');

const knexConfig = require('./knexfile.js');

const db = knex(knexConfig.development);

const bcrypt = require('bcryptjs');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});



server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username', 'password')
    .then(users => {
      if (!users || users.length < 0) 
      {
        res.status(404).json({ missing: 'Could not find users in the database, either empty or try again' });        
      } else 
      {
        res.status(200).json(users);
      }

    })
    .catch(err => res.send(err));
});

server.post('/api/register', (req, res) => {
  const creds = req.body;

  // 1. hash the password
  const hash = bcrypt.hashSync(creds.password, 15);
  creds.password = hash; // so we can't access the plain text password

  // 2. Save user into db

  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res.status(201).json({ newUserId: id }) // when they post, this is what shows
    })
    .catch(err => res.status(500).json(err));
});


server.listen(4405, () => console.log('\nrunning on port 4405\n'));