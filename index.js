const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./data/db');

const server = express();
server.use(express.json());

const PORT = 8000;

server.get('/', (req, res) => {
  res.send('Sanity Check');
});

server.get('/users', (req, res) => {
  db('users')
   .then(response => {
     res.json(users);
   })
   .catch(err => {
     res.send(err);
   })
});

server.post('/register', (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db('users').insert(credentials)
    .then(ids => {
      db('users').where('id', ids[0]).first()
      .then(user => {
        res.status(201).json(user);
      });
    })
    .catch(err => {
      res.send(err);
    });
});

server.post('/login', (req, res) => {
  const credentials = req.body;

  db('users').where({username: credentials.username}).first()
  .then(user => {
    const passwordsMatch = bcrypt.compareSync(
      credentials.password,
      user.password
    );
    if (user && passwordsMatch) {
      res.send('welcome');
    } else {
      return res.status(401).json({error: 'Incorrect credentials'});
    }
  })
  .catch(error => {
    res.status(500).json({error})
  });
});

server.listen(PORT, () => {
  console.log(`UP and RUNNING on ${PORT}`)
});