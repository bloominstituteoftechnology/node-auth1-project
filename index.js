const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

//sanity check
server.get('/', (req, res) => {
  res.send({ message: 'it is alive' });
});

//register new users
server.post('/api/register', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if (user) {
      res.status(422).json({ message: 'A user with that username already exists' })
    } else {
      const hash = bcrypt.hashSync(creds.password, 14);
      creds.password = hash;
      db('users').insert(creds).then(id => res.status(201).json(id)).catch(err => res.json(err))
    }
  }).catch(err => res.json(err));
})

//login existing users
server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users').where({ username: creds.username }).first().then(user => {
    if (user && bcrypt.compareSync(creds.password, user.password)){
      //passwords match and correct username
      res.status(200).json({ message: 'welcome to the thunderdome!' });
    } else {
      //messed up
      res.status(401).json({ message: 'you shall not pass'})
    }
  }).catch(err => res.json(err))
})

//list of users if logged in
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json(err));
})

server.listen(9000, () => {
  console.log('\nrunning on port 9000\n');
})
