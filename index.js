const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Server Running!');
});

server.get('/api/users', (req, res) => {
  db('users')
  .select('id', 'username', 'password')
  .then(users => {
    res.json(users)
  })
  .catch(err => res.json(err));
})

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 14);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => res.json(err));
})

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: 'Welcome!' });
      } else {
        res.status(401).json({ message: 'Username or Password is incorrect!'});
      }
    })
    .catch(err => res.json(err));
})

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db('users')
  .where({ id: id })
  .del()
  .then(count => {
    res.status(200).json({ count });
  })
  .catch(err => res.status(500).json(err));
})


server.listen(3300, () => console.log('\nrunning on port 3300\n'));