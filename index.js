const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig');

const server = express();

server.use(express.json());
server.unsubscribe(cors());

server.post('/api/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 11);
  creds.password = hash;
  db('user_info')
    .insert(creds)
    .then((id) => {
      res.status(201).json(id);
    })
    .catch((err) => res.json(err));
});

server.post('/api/login', (req, res) => {
  const creds = req.body;
  db('user_info')
    .where({ username: creds.username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res.status(200).json({ message: 'welcome!' });
      } else {
        res.status(401).json({ message: 'wrong username or password' });
      }
    })
    .catch((err) => res.json(err));
});

server.get('/api/users', (req, res) => {
  db('user_info')
    .select('id', 'username')
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.send(err));
});

server.listen(3300, () => console.log('\n==SERVER RUNNING ON 3300==\n'));
