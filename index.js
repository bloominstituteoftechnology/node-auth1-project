const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex');
const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
  res.status(200).json({ message: 'GOGOGOGOGO!' });
})

server.post('/api/register', (req, res) => {
  let cred = req.body;
  cred.password = bcrypt.hashSync(cred.password, 5);

  db.insert(cred).into('users')
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Invalid input' });
    })
});

server.post('/api/login', (req, res) => {
  let cred = req.body;

  db('users').where({ username: cred.username }).first()
    .then((user) => {
      if(user && bcrypt.compareSync(cred.password, user.password)) {
        res.status(200).json({ message: 'Logged in' });
      } else {
        res.status(401).json({ message: 'YOU SHALL NOT PASS!' });
      }

    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err);
    })
});

server.get('/api/users', (req, res) => {
  db('users').select('id', 'username')
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((err) => {
    console.error(err);
    res.status(404).json({ message: 'Database not found' });
  })
});

server.listen(8000, () => {
  console.log('== LISTENING ON PORT 8L ==');
})
