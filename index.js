const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('./database/dbConfig');

const server = express();
const port = 8080;

// middleware
server.use(express.json());

// test api
server.get('/', (_, res) => res.send('API is running...'));

// ===================== ENDPOINTS =====================
// retrieve users
server.get('/api/users', (_, res) => {
  db('users')
    .select('id', 'username') // exclude password col
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.status(500).json(err));
});

// register a new user
server.post('/api/register', (req, res) => {
  // initial value: {}
  // will populate it with the appropriate props when creating a new user
  // props: username, password
  console.log(req.body)
  const creds = req.body;

  // generates a hash for the user's password
  const hash = bcrypt.hashSync(creds.password, 8); // rounds to 2^X; in this case, X is 8

  // overrides the password prop with the hash
  creds.password = hash;

  // save the new user to the database
  db('users')
    .insert(creds)
    .then(id => {
      res.status(201).json({ message: `ID ${id} created` });
    })
    .catch(err => res.status(500).json(err));
});

server.listen(port, () => console.log(`Listening to port: ${port}`));
