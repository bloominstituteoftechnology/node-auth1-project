// depends
const express = require('express');
const helmet = require('helmet');
const knexConfig = require('./knexfile');
const knex = require('knex');

const server = express(); //server

const port = "8000";
server.listen(port, () => {console.log(`=*= Sprint Challenge Rolling on Port ${port}- =*=`)});

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const db = require('./data/dbConfig.js');

const server = express();
port = 7000;

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Sane')
})


server.post('/register', (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 10);
  creds.password = hash;

  db('users')
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      res
        .status(201)
        .json({ newUserId: id });
    })
    .catch(err => {
      res
        .status(500)
        .json(err);
    });
});

server.post('/login', (req, res) => {
  const creds = req.body;

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        res
          .status(200)
          .json({ welcome: user.username });
      } else {
        res
          .status(401)
          .json({ message: 'You shall not pass!'})
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ err });
    })
})


server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = "8000";
server.listen(port, () => {console.log(`=*= Sprint Challenge Rolling on Port ${port}- =*=`)});
