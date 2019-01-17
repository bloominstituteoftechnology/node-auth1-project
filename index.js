const express = require('express');
const server = express();
const knex = require('knex');
const knexConfig = require('./knexfile.js');
const bcrypt = require('bcryptjs');

const db = knex(knexConfig.development);

const PORT = process.env.PORT || 3300;

server.use(express.json());
// server.use(cors());

server.get('/', (req, res) => {
  res.send('I am responding to your GET request, Dave!');
});

server.post('/api/register', (req, res) => {
console.log("POST register is working")
  const user = req.body;
  // user.password = bcrypt.hash(user.password);
  db('users').insert(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] });
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

server.post('/api/login', (req, res) => {
  console.log("POST login is working")
  const bodyUser = req.body;
  db('users').where('username', bodyUser.username)
    .then(users => {
      // username and valid password from client == password from db
      if (users.length && bcrypt.compareSync (bodyUser.password, users[0].password))
      {
        res.json({ info: "correct" });
      } else {
        res.status(404).json({ err: " invalid username or password"})
      }
    })
    .catch(err => {
      res.status(500).send(err);
    })
});

server.get('/api/users', (req, res) => {
  console.log("GET users is working")
    db('users')
      .select('id', 'username')
      .then(users => {
        res.json(users);        
      })
      .catch(err => res.send(err));
});



// server.listen(3300, () => console.log('I live therefore I AM running on port 3300'));
server.listen(PORT, () => {
  console.log(`I live therefore I AM running on port ${PORT}`);
});